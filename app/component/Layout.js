"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Nav from "./Nav";
import { useContext, useState } from "react";
import Logo from "./Logo";
import { ContextData } from "./context/Context.";
import Image from "next/image";

export default function Layout({ children }) {
  const { sun, mode } = useContext(ContextData);

  const { data: session } = useSession();
  const [showNav, setShowNav] = useState(false);
  return (
    <>
      {!session ? (
        <div className=" w-screen h-screen flex items-center justify-center">
          <div className="text-center">
            <button
              onClick={() => signIn("google")}
              className="bg-white p-2 px-4 text-black w-full rounded-lg"
            >
              <div className="google-btn">
                <div className="google-icon-wrapper">
                  <Image
                    className="google-icon"
                    width={40}
                    height={40}
                    alt="g-img"
                    src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                  />
                </div>
                <div className="btn-text">Login with Google</div>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className={mode == sun ? "main-back-light" : "main-back-dark"}>
          <div
            className={
              "xs:fixed sm:fixed md:static w-full " +
              (mode == sun ? "main-back-light" : "main-back-dark")
            }
          >
            <div className="flex justify-start xs:gap-5 xs:pl-2 sm:gap-5 sm:pl-2 md:gap-5 md:pl-2 items-center h-10 md:hidden">
              <button
                className="left-2 "
                onClick={() => setShowNav(true)}
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
              <div className="lg:hidden xl:hidden 2xl:hidden">
                <Logo />
              </div>
              {showNav && (
                <button
                  className={
                    (showNav ? "right-0" : "-right-full ") +
                    " transition-all duration-1000 fixed "
                  }
                  type="button"
                  onClick={() => setShowNav(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex 2xl:min-h-screen xl:min-h-screen lg:min-h-screen md:min-h-screen sm:min-h-screen xs:min-h-screen overflow-hidden">
              <Nav show={showNav} />
              <div
                className={
                  " height-data text-black flex-grow mt-2 mr-2 mb-2 rounded-lg p-4  xs:ml-2 md:ml-2 lg:ml-0" +
                  (mode == sun
                    ? " main-back-light-content"
                    : " main-back-dark-content")
                }
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
