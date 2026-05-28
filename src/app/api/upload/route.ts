import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    // Upload to Supabase storage
    const fileName = `products/${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    console.log('Uploading file:', fileName, file.type, file.size);

    const { data, error } = await supabase.storage.from('images').upload(fileName, file);

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);

    return NextResponse.json({ 
      success: true, 
      url: urlData.publicUrl,
      fileName 
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
