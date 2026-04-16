import { formatDate } from '@/utils/format'
import React from 'react'

const BlogDetailTitle = ({ title, author, createdAt, createdUser }) => {
    return (
        <div className="blogdetail__title">
            <h1 className="title --t2">{title || ""}</h1>
            <ul className="meta">
                <li className="meta__item">Đăng bởi {`${author?.firstName || ""} ${author?.lastName || ""}`.trim() || "Admin"}</li>
                <li className="meta__item">{createdUser?.firstName ? `${createdUser.firstName} ${createdUser.lastName}` : ""}</li>

                <li className="meta__item">{formatDate(createdAt || "")}</li>
            </ul>
        </div>
    )
}

export default BlogDetailTitle