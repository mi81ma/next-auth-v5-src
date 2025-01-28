import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { AlertType, AlertCondition } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { symbol, type, condition, value } = body;

    // Validate input
    if (!symbol || !type || !condition || value === undefined) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Create alert
    const alert = await db.alert.create({
      data: {
        symbol,
        type: type as AlertType,
        condition: condition as AlertCondition,
        value,
        userId: session.user.id,
      },
    });

    return NextResponse.json(alert);
  } catch (error) {
    console.error("[ALERTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('symbol');

    const whereClause = {
      userId: session.user.id,
      ...(symbol ? { symbol } : {}),
    };

    const alerts = await db.alert.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error("[ALERTS_GET]", error);
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
    const alertId = searchParams.get('id');

    if (!alertId) {
      return new NextResponse("Alert ID is required", { status: 400 });
    }

    const alert = await db.alert.findUnique({
      where: { id: alertId },
    });

    if (!alert) {
      return new NextResponse("Alert not found", { status: 404 });
    }

    if (alert.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await db.alert.delete({
      where: { id: alertId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ALERTS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
