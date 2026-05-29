import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const isPrimary = formData.get('isPrimary') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/bmp', 'image/tiff'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: `File type ${file.type} not supported. Use: JPG, PNG, WEBP, GIF, SVG, BMP, TIFF` }, { status: 400 });
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum 10MB' }, { status: 400 });
    }

    const fileName = `products/${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    console.log('Uploading file:', fileName, file.type, file.size);

    // Try Supabase storage first
    try {
      const { data, error } = await supabase.storage.from('images').upload(fileName, file);

      if (!error) {
        const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
        return NextResponse.json({ 
          success: true, 
          url: urlData.publicUrl,
          fileName,
          source: 'supabase'
        });
      }
      
      console.error('Supabase upload error:', error);
      // Fall back to local storage if Supabase fails
    } catch (supabaseError) {
      console.error('Supabase upload failed, trying local storage:', supabaseError);
    }

    // Fallback: Save to public folder locally
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create uploads directory if it doesn't exist
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'products');
      await mkdir(uploadDir, { recursive: true });
      
      // Write file
      const filePath = join(uploadDir, `${Date.now()}-${file.name.replace(/\s/g, '_')}`);
      await writeFile(filePath, buffer);
      
      // Return public URL
      const publicUrl = `/uploads/products/${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      
      return NextResponse.json({ 
        success: true, 
        url: publicUrl,
        fileName,
        source: 'local'
      });
    } catch (localError) {
      console.error('Local upload error:', localError);
      return NextResponse.json({ error: 'Upload failed: Both Supabase and local storage failed' }, { status: 500 });
    }

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
