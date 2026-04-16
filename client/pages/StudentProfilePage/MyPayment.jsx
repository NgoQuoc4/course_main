import { useAuthContext } from "@/context/AuthContext"
import { formatCurrency, formatDate } from "@/utils/format";
import { Empty } from "antd";

const MyPayment = () => {
    const { paymentInfo } = useAuthContext();
    return (
        <div className="tab__content-item" style={{ display: 'block' }}>
            {!!!paymentInfo.length &&
                <Empty
                    description="Không tìm thấy dữ liệu nào"
                    style={{ margin: "0 auto" }}
                />}
            {!!paymentInfo.length &&
                paymentInfo.map((item, index) => {
                    const { _id, paymentMethod, createdAt, courses = [], totalAmount } = item;
                    const courseName = courses[0]?.course?.title || "Khóa học";
                    return (
                        <div key={_id || index} className="itemhistory">
                            <div className="name">{courseName}</div>
                            <div className="payment">{paymentMethod}</div>
                            <div className="date">{formatDate(createdAt)}</div>
                            <div className="money">{formatCurrency(totalAmount)}VND</div>
                        </div>
                    )
                })}

        </div>
    )
}

export default MyPayment