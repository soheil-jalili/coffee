"use client";
import React from "react";
import styles from "./tabs.module.css";
import { useState } from "react";
import Description from "./Description";
import MoreInfoes from "./MoreInfoes";
import Comments from "./Comments";
import CommentType from "@/types/comment-type";
import mongoose from "mongoose";
const Tabs = ({
  product,
  emailLoginUser,
}: {
  emailLoginUser: string;
  product: {
    _id: string;
    longDescription: string;
    weight: number;
    comments: CommentType[];
    name: string;
    suitableFor: string;
    smell: string;
  };
}) => {
  const [tab, setTab] = useState("description");

  return (
    <>
      <div data-aos="fade-left" className={styles.tabs}>
        <ul>
          <li>
            <button
              className={tab === "description" ? styles.active_tab : ""}
              onClick={() => setTab("description")}
            >
              توضیحات
            </button>
          </li>
          <li>
            <button
              className={tab === "moreInfoes" ? styles.active_tab : ""}
              onClick={() => setTab("moreInfoes")}
            >
              اطلاعات بیشتر
            </button>
          </li>
          <li>
            <button
              className={tab === "comments" ? styles.active_tab : ""}
              onClick={() => setTab("comments")}
            >
              نظرات (
              {product.comments.filter((comment) => comment.isAccept).length})
            </button>
          </li>
        </ul>

        <div className={styles.contents}>
          <section>
            {tab === "description" && (
              <Description longDescription={product.longDescription} />
            )}
            {tab === "moreInfoes" && (
              <MoreInfoes
                weight={product.weight}
                smell={product.smell}
                suitableFor={product.suitableFor}
              />
            )}
            {tab === "comments" && (
              <Comments
                name={product.name}
                _id={product._id}
                comments={JSON.parse(JSON.stringify(product.comments))}
                emailLoginUser={emailLoginUser}
              />
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Tabs;
