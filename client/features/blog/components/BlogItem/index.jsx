import PATHS from '@/constants/paths'
import { formatDate } from '@/utils/format'
import React from 'react'
import { Link } from 'react-router-dom'

const BlogItem = ({ thumbnail, title, author, slug, createdAt, category }) => {
    return (
        <div className="blog__list-item">
            <div className="img">
                <Link to={`${PATHS.BLOG.INDEX}/${slug}`}>
                    <img src={thumbnail || ""} alt="Khóa học CFD" className="course__thumbnail" />
                </Link>
            </div>
            <div className="content">
                <p className="label">{category?.name || ""}</p>
                <h2 className="title --t3">
                    <Link to={`${PATHS.BLOG.INDEX}/${slug}`}>{title || ""}</Link>
                </h2>
                <div className="content__info">
                    <div className="user">
                        <div className="user__img">
                            <img src={author?.avatar || "img/avatar.jpg"} alt="Avatar teacher" />
                        </div>
                        <p className="user__name">{`${author?.firstName || ""} ${author?.lastName || ""}`.trim() || "Author"}</p>
                    </div>

                    <div className="date">{formatDate(createdAt || "")}</div>
                </div>
            </div>
        </div>
    )
}

export default BlogItem