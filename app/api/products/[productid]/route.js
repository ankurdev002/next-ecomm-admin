import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";
import { isAdminRequest } from "../../auth/[...nextauth]/route";

export async function GET(req, res) {
  const productId = res.params.productid;
  const record = { _id: productId };
  mongooseConnect();
  await isAdminRequest();

  const result = await Product.findById(record);
  return NextResponse.json(result);
}

export async function PUT(req, res) {
  const productId = res.params.productid;
  const filter = { _id: productId };
  const payload = await req.json();
  mongooseConnect();
  await isAdminRequest();

  const result = await Product.findOneAndUpdate(filter, payload);
  return NextResponse.json(result);
}

export async function DELETE(req, res) {
  const productId = res.params.productid;
  const record = { _id: productId };
  mongooseConnect();
  await isAdminRequest();

  const result = await Product.deleteOne(record);
  return NextResponse.json(result);
}
