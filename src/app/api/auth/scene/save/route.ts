import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { username, objects } = await req.json();

        if (!username) {
            return NextResponse.json({ message: 'Unauthorized session' }, { status: 401 });
        }

        const mongooseInstance = await connectToDatabase();
        const db = mongooseInstance.connection.db;

        if (!db) {
            throw new Error('Database connection layer is unavailable');
        }
        
        await db.collection('scenes').updateOne(
            { username },
            { $set: { objects, updatedAt: new Date() } },
            { upsert: true }
        );

        return NextResponse.json({ message: 'Layout synchronized successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: 'Database transaction failed', error: error instanceof Error ? error.message : 'Unknown' },
            { status: 500 }
        );
    }
}