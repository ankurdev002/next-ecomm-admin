"use client";
import ButtonSave from "@/app/component/ButtonSave";
import Layout from "@/app/component/Layout";
import Spinner from "@/app/component/Spinner";
import { ContextData } from "@/app/component/context/Context.";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { toast } from "react-toastify";

export default function NewProducts() {
  const { sun, mode } = useContext(ContextData);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [goToProducts, setGoToProducts] = useState(false);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [category, setcategory] = useState("");
  const [Categories, setCategories] = useState([]);
  const [productProperties, setProductProperties] = useState({});

  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  const createProduct = async (e) => {
    e.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
    try {
      let response = await axios.post("/api/products", data);
      setTimeout(() => {
        setGoToProducts(true);
      }, 2000);

      if (response) {
        toast.success("Added Product Successfully", {
          style: {
            backgroundColor: mode == sun ? "var(--lightg)" : "var(--lightblk)", // Use the CSS variable for the background color
            color: mode == sun ? "var(--lightblk)" : "var(--ligcont)",
            boxShadow:
              mode == sun
                ? "0 0 5px var(--lightg) inset"
                : "0 0 5px var(--ligcont) inset", // Use the CSS variable for the text color
          },
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      console.log("Error: Could not retrieve the page.");
      toast.error("Please Fill Correct Details", {
        style: {
          backgroundColor: mode == sun ? "var(--lightg)" : "var(--lightblk)", // Use the CSS variable for the background color
          color: mode == sun ? "var(--lightblk)" : "var(--ligcont)", // Use the CSS variable for the text color
        },
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  if (goToProducts) {
    router.push("/products");
  }

  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const imageDataUpload = async (e) => {
    if (e.target.files?.length > 0) {
      setUploading(true);
    }
    const data = new FormData();
    data.append("file", e.target.files[0]);
    data.append("upload_preset", "mystore");
    data.append("cloud_name", "dk9srbdy6");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dk9srbdy6/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const res2 = await res.json();
    setImages([...images, res2.url]);
    setUploading(false);
    return res2.url;
  };

  const updateImagesOrder = (images) => {
    setImages(images);
  };

  function changeProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesData = [];
  if (Categories.length > 0 && category) {
    let CatInfo = Categories.find(({ _id }) => _id === category);
    propertiesData.push(...CatInfo.properties);
    while (CatInfo?.parent?._id) {
      const parentCat = Categories.find(
        ({ _id }) => _id === CatInfo?.parent?._id
      );
      propertiesData.push(...parentCat.properties);
      CatInfo = parentCat;
    }
  }

  return (
    <Layout>
      <form onSubmit={createProduct}>
        <h1>New Product</h1>
        <div className="field">
          <label>Product Name</label>
          <input
            className={mode == sun ? "l" : "d"}
            type="text"
            placeholder="Product Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="field-select">
          <label>Category</label>
          <select
            className={mode == sun ? "l" : "d"}
            value={category}
            onChange={(e) => setcategory(e.target.value)}
          >
            <option value="">Uncategorized</option>
            {Categories.length > 0 &&
              Categories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
          </select>
          <div className="trans-data">
            {propertiesData.length > 0 &&
              propertiesData.map((itemProperty, index) => (
                <div
                  className="flex items-start justify-center h-16 flex-col"
                  key={index}
                >
                  <label>{itemProperty.name}</label>
                  <select
                    className={mode == sun ? "l" : "d"}
                    value={productProperties[itemProperty.name]}
                    onChange={(e) =>
                      changeProductProp(itemProperty.name, e.target.value)
                    }
                  >
                    {itemProperty.values.map((v, i) => (
                      <option value={v} key={i}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
          </div>
        </div>
        <div className="field h-24">
          <label>Photos</label>
          <div className="mb-2 flex items-center justify-start gap-2 h-full w-full photo-container">
            <div className="overflow-y-auto flex items-center justify-start  gap-2 h-full w-3/4">
              <ReactSortable
                className="flex gap-2 items-center justify-start"
                list={images}
                setList={updateImagesOrder}
              >
                {images.length > 0 &&
                  images.map((imgs, index) => {
                    return (
                      <div className="flex relative" key={index}>
                        <Image
                          width={80}
                          height={85}
                          className="rounded-lg img-data "
                          src={imgs}
                          alt="upload-photo"
                        />
                        <svg
                          onClick={() => removeImage(index)}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 absolute end-0 text-red-500 cursor-pointer"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    );
                  })}
              </ReactSortable>
              {uploading && (
                <div className=" flex items-center justify-center loader-img">
                  <Spinner />
                </div>
              )}
            </div>
            <label
              className={
                "l-0 w-24 h-24 cursor-pointer border text-center flex items-center justify-center flex-col text-gray-500 text-sm gap-1 rounded-lg " +
                (mode == sun ? "l" : "d")
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <div>Upload</div>
              <input
                type="file"
                className="hidden"
                onChange={imageDataUpload}
              />
            </label>
          </div>
        </div>
        <div className="field">
          <label>Product Description</label>
          <textarea
            className={mode == sun ? "l" : "d"}
            type="text"
            placeholder="Desciption"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="field">
          <label>Price (in INR)</label>
          <input
            className={mode == sun ? "l" : "d"}
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <ButtonSave />
      </form>
    </Layout>
  );
}
