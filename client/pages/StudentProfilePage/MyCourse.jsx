import CourseItem from "@/features/courses/components/CourseItem";
import { useAuthContext } from "@/context/AuthContext"
import { Empty } from "antd";

const MyCourse = () => {
    const { courseInfo } = useAuthContext();
    return (
        <div className="tab__content-item" style={{ display: 'block' }}>
            <div className="courses__list">
                {!!!courseInfo.length &&
                    <Empty
                        description="Không tìm thấy dữ liệu nào"
                        style={{ margin: "0 auto" }}
                    />}
                {!!courseInfo.length && courseInfo.map((item, index) => (
                    <CourseItem
                        key={item._id || item.id || index}
                        {...item} />
                ))}
            </div>
        </div>
    )
}
export default MyCourse
