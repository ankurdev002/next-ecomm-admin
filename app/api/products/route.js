import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "../auth/[...nextauth]/route";

export async function POST(req) {
  const { title, description, price, images, category, properties } =
    await req.json();
  mongooseConnect();
  await isAdminRequest();

  const ProductDoc = await Product.create({
    title,
    description,
    price,
    images: JSON.stringify(images),
    category,
    properties,
  });
  return NextResponse.json(ProductDoc);
}

export async function GET() {
  mongooseConnect();
  await isAdminRequest();

  let record = await Product.find();
  return NextResponse.json(record);
}
