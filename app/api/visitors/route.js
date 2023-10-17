import { mongooseConnect } from "@/lib/mongoose";
import { Visitor } from "@/models/Visitors";
import { NextResponse } from "next/server";

export async function GET() {
  await mongooseConnect();
  const result = await Visitor.findOne({});
  let count = 0;
  if (result) {
    count = result.count;
  } else {
    await Visitor.create({ count });
  }
  return NextResponse.json({ count });
}

export async function POST() {
  await mongooseConnect();
  const updatedResult = await Visitor.findOneAndUpdate(
    {},
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  );
  const count = updatedResult ? updatedResult.count : 0;
  return NextResponse.json({ count: count });
}
