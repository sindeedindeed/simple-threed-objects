import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get('username');

        if (!username) {
            return NextResponse.json({ message: 'Missing username parameter' }, { status: 400 });
        }

        const mongooseInstance = await connectToDatabase();
        const db = mongooseInstance.connection.db;

        if (!db) {
            throw new Error('Database layer unavailable');
        }

        const scene = await db.collection('scenes').findOne({ username });

        return NextResponse.json(scene || { objects: [] }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to load layout' }, { status: 500 });
    }
}