import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "../auth/[...nextauth]/route";

export async function POST(req) {
  const { name, parentCategory, properties } = await req.json();
  mongooseConnect();
  await isAdminRequest();
  const categoryDoc = await Category.create({
    name,
    parent: parentCategory || undefined,
    properties,
  });
  return NextResponse.json(categoryDoc);
}

export async function GET() {
  mongooseConnect();
  await isAdminRequest();

  let record = await Category.find().populate("parent");
  return NextResponse.json(record);
}

export async function PUT(req) {
  const { name, parentCategory, properties, _id } = await req.json();
  mongooseConnect();
  await isAdminRequest();

  const categoryDoc = await Category.updateOne(
    { _id },
    {
      name,
      parent: parentCategory || undefined,
      properties,
    }
  );
  return NextResponse.json(categoryDoc);
}

//getting id from params of url for deletion without creating dynamic route

export async function DELETE(req, res) {
  const data = await req.url;
  const url = new URL(data);
  const searchParams = url.searchParams;
  const _id = searchParams.get("_id");
  mongooseConnect();
  await isAdminRequest();

  await Category.deleteOne({ _id });
  return NextResponse.json("ok");
}
