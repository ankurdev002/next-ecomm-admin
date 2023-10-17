"use client";
import Layout from "@/app/component/Layout";
import { ContextData } from "@/app/component/context/Context.";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function DeleteProductPage(props) {
  const { sun, mode } = useContext(ContextData);

  const router = useRouter();
  const [productInfo, setProductInfo] = useState();
  const id = props.params.deleteid;
  useEffect(() => {
    axios.get("/api/products/" + id).then((res) => {
      setProductInfo(res.data);
    });
  }, [id]);

  const deleteRecord = async () => {
    let response = await axios.delete("/api/products/" + id);
    if (response) {
      toast.error("Deleted Product Successfully", {
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
      setTimeout(() => {
        router.push("/products");
      }, 2000);
    }
  };

  const goBack = () => {
    router.push("/products");
  };

  return (
    <Layout>
      <div className="w-full flex flex-col items-center justify-center h-full pop-up-delete">
        <div className="flex items-center justify-center flex-col bg-blue-900 p-5 text-white rounded-md scale-up-center">
          <h1 className="text-white">
            Do You Really Want To Delete Product {productInfo?.title}?
          </h1>
          <div className="flex justify-around w-full p-10">
            <button
              onClick={deleteRecord}
              className="bg-white text-blue-900 px-3 py-1 rounded-full transition-all ease-in-out duration-1000 hover:bg-green-300"
            >
              Yes
            </button>
            <button
              className="bg-white text-blue-900 px-3 py-1 rounded-full transition-all ease-in-out duration-1000 hover:bg-red-300"
              onClick={goBack}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
