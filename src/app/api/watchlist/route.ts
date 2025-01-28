import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { symbol, name } = body;

    if (!symbol || !name) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const watchlistItem = await db.watchlistItem.create({
      data: {
        symbol,
        name,
        userId: session.user.id,
      },
    });

    return NextResponse.json(watchlistItem);
  } catch (error) {
    console.error("[WATCHLIST_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const watchlist = await db.watchlistItem.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(watchlist);
  } catch (error) {
    console.error("[WATCHLIST_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return new NextResponse("Symbol is required", { status: 400 });
    }

    await db.watchlistItem.delete({
      where: {
        userId_symbol: {
          userId: session.user.id,
          symbol,
        },
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[WATCHLIST_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
