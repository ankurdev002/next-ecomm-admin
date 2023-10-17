"use client";
import { useContext, useEffect, useState } from "react";
import ButtonSave from "../component/ButtonSave";
import Layout from "../component/Layout";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import { ContextData } from "../component/context/Context.";
import { toast } from "react-toastify";
import Loader from "../component/Loader";

function CategoryPage({ swal }) {
  const { sun, mode } = useContext(ContextData);
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [Categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("/api/categories").then((result) => setCategories(result.data));
  }
  async function saveCategory(e) {
    e.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };

    if (editedCategory) {
      data._id = editedCategory._id;
      let update = await axios.put("/api/categories", data); //update category
      if (update) {
        toast.success("Updated Category Successfully", {
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
      setEditedCategory(null);
    } else {
      let response = await axios.post("/api/categories", data); //create new category
      if (response) {
        toast.success("Added Category Successfully", {
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
    }
    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  }

  function editCategory(categoryData) {
    setEditedCategory(categoryData);
    setName(categoryData.name);
    setParentCategory(categoryData.parent?._id);
    setProperties(
      categoryData.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  }

  function deleteCategory(categoryData) {
    swal
      .fire({
        title: "Are You Sure",
        text: `Do You Want To Delete ${categoryData.name}`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = categoryData;
          let data = await axios.delete("/api/categories?_id=" + _id);
          if (data) {
            toast.error("Deleted Category Successfully", {
              style: {
                backgroundColor:
                  mode == sun ? "var(--lightg)" : "var(--lightblk)", // Use the CSS variable for the background color
                color: mode == sun ? "var(--lightblk)" : "var(--ligcont)",
                boxShadow:
                  mode == sun
                    ? "0 0 5px var(--lightg) inset"
                    : "0 0 5px var(--ligcont) inset", // Use the CSS variable for the text color
              },
              position: toast.POSITION.TOP_CENTER,
            });
          }
          fetchCategories();
        }
      });
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }

  function handlePropertyNameChange(index, item, newName) {
    setProperties((prev) => {
      const copyProperties = [...prev];
      copyProperties[index].name = newName;
      return copyProperties;
    });
  }

  function handlePropertyValuesChange(index, item, newValues) {
    setProperties((prev) => {
      const copyProperties = [...prev];
      copyProperties[index].values = newValues;
      return copyProperties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((i, index) => {
        return index !== indexToRemove;
      });
    });
  }

  return (
    <Layout>
      <h1>CategoryPage</h1>
      <div className="field1 cat-height">
        <label>
          {editedCategory
            ? `Edit Category ${editedCategory.name}`
            : "Create New Category"}
        </label>
        <form onSubmit={saveCategory}>
          <div className="flex flex-col">
            <div className="field">
              <input
                className={sun == mode ? "l" : "d"}
                type="text"
                placeholder="New Category Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
            <div className="field-select">
              <label>Select Parent Category</label>

              <select
                className={sun == mode ? "l" : "d"}
                onChange={(e) => setParentCategory(e.target.value)}
                value={parentCategory}
              >
                <option value="">No Parent Category</option>
                {Categories.length > 0 &&
                  Categories.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            <div
              className="field flex flex-col justify-start items-start"
              style={{ marginBottom: "0" }}
            >
              <label>Properties</label>
              <button
                onClick={addProperty}
                type="button"
                className={
                  "w-2/4 x-1 py-1 rounded-sm " + (mode == sun ? "l" : "d")
                }
              >
                Add New Property
              </button>
              <div className="h-12 overflow-y-auto">
                {properties.length > 0 &&
                  properties.map((item, index) => (
                    <div className="flex gap-4 py-2" key={index}>
                      <div className="field">
                        <input
                          className={sun == mode ? "l" : "d"}
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            handlePropertyNameChange(
                              index,
                              item,
                              e.target.value
                            )
                          }
                          placeholder="property name (example:color)"
                        />
                      </div>
                      <div className="field">
                        <input
                          className={sun == mode ? "l" : "d"}
                          type="text"
                          value={item.values}
                          onChange={(e) =>
                            handlePropertyValuesChange(
                              index,
                              item,
                              e.target.value
                            )
                          }
                          placeholder="values , comma separated"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProperty(index)}
                        className="bg-red-200 px-2 py-1 rounded-sm text-sm mb-2 text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex gap-2">
              {editedCategory && (
                <button
                  className="px-8 py-2 bg-red-200 text-white rounded-md transition-all duration-700 hover:text-red-500"
                  type="button"
                  onClick={() => {
                    setEditedCategory(null);
                    setName("");
                    setParentCategory("");
                    setProperties([]);
                  }}
                >
                  Cancel
                </button>
              )}
              <ButtonSave />
            </div>
          </div>
        </form>
      </div>
      {!editedCategory &&
        (Categories.length == 0 ? (
          <div
            className={
              "loaders-container-main-cate " +
              (mode == sun ? "products-headers-l" : "products-headers-d")
            }
          >
            <div class="left_back"></div>
            <div class="right_back"></div>
            <Loader />
          </div>
        ) : (
          <div className="table-products-list">
            <ul
              className={
                "products-headers  xs:px-2 overflow-hidden " +
                (mode == sun ? "products-headers-l" : "products-headers-d")
              }
            >
              <li className="header">Category Name</li>
              <li className="header">Parent Category</li>
              <li className="header">Operation</li>
            </ul>
            <div className="list-product-details">
              {Categories.length > 0 &&
                Categories.map((item) => (
                  <ul key={item._id} className="products">
                    <li className="header">{item.name}</li>
                    <li className="header">{item?.parent?.name}</li>
                    <li className="header">
                      <button
                        onClick={() => editCategory(item)}
                        className="bg-blue-900 text-white py-1 px-2 items-center rounded-sm inline-flex"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(item)}
                        className="bg-red-400 text-white py-1 px-2 rounded-sm inline-flex items-center"
                      >
                        Delete
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </li>
                  </ul>
                ))}
            </div>
          </div>
        ))}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <CategoryPage swal={swal} />);
