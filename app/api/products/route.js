import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "../auth/[...nextauth]/route";

export async function POST(req) {
  // console.log(req.body);
  const { title, description, price, images, category, properties } =
    await req.json();
  // console.log(title, description, price, JSON.stringify(images));
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
