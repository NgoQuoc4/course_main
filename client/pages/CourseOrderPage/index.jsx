import { useNavigate, useParams } from "react-router-dom";
import InfoOrder from "./InfoOrder";
import PaymentOrder from "./PaymentOrder";
import FormOrder from "./FormOrder";
import useMutation from "@/hooks/useMutation";
import useQuery from "@/hooks/useQuery";
import { courseServices } from "@/features/courses/services/courseServices";
import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "@/utils/format";
import { ROLES } from "@/constants/roles";
import Button from "@/components/Button";
import { useAuthContext } from "@/context/AuthContext";
import { message } from "antd";
import { orderService } from "@/features/order/services/orderService";
import PATHS from "@/constants/paths";

export const CourseOrderPage = () => {
  const { courseSlug } = useParams();
  const navigate = useNavigate();

  const { data: courseDetailData } = useQuery({
    queryKey: ["course-detail", courseSlug],
    queryFn: () => courseServices.getCourseBySlug(courseSlug),
    enabled: !!courseSlug,
  });

  const { teams, price, tags } = courseDetailData || {};

  const modifiedInfo = {
    ...courseDetailData,
    teacherInfo: teams?.find((item) => item.tags.includes(ROLES.teacher)) || {},
    price: formatCurrency(price || ""),
  };

  //  form
  const { courseInfo, handleGetProfileCourse, handleGetProfilePayment } =
    useAuthContext();
  const isAlreadyOrder =
    courseInfo?.some((item) => item?.course?.slug === courseSlug) || false;

  const formRef = useRef({});
  useEffect(() => {
    if (isAlreadyOrder && courseInfo?.length > 0) {
      const orderedCourse = courseInfo?.find(
        (item) => item?.course?.slug === courseSlug,
      );
      formRef.current.setForm({
        name: orderedCourse.name || "",
        email: orderedCourse.customer.email || "",
        phone: orderedCourse.phone || "",
        type: orderedCourse.type || "",
      });
      setPaymentMethod(orderedCourse.paymentMethod);
    }
  }, [isAlreadyOrder, courseInfo, courseSlug]);

  const { loading: orderLoading, execute: orderCourse } = useMutation(
    orderService.orderCourse,
  );

  const _onOrder = async (e) => {
    const form = formRef.current.form;
    const setError = formRef.current.setError;
    // validate order form
    e.preventDefault();
    // start validate
    const errorObject = {};

    if (form.name === "") {
      errorObject.name = "Vui lòng điền họ và tên";
    }
    if (form.email === "") {
      errorObject.email = "Vui lòng điền email";
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email)
    ) {
      errorObject.email = "Vui lòng điền đúng định dạng email";
    }
    if (form.phone === "") {
      errorObject.phone = "Vui lòng điền số điện thoại";
    } else if (!/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(form.phone)) {
      errorObject.phone = "Vui lòng điền đúng định dạng phone";
    }
    if (form.type === "") {
      errorObject.type = "Vui lòng chọn phương thức học";
    }
    // end validate
    setError(errorObject);
    if (Object.keys(errorObject).length > 0) {
      console.log("Error: ", errorObject);
    } else {
      console.log("Check courseDetailData:", courseDetailData);
      if (!courseDetailData?._id) {
        message.error("Thông tin khóa học chưa tải kịp. Vui lòng thử lại!");
        return;
      }

      if (paymentMethod) {
        const payload = {
          courses: [{ course: courseDetailData._id }],
          name: form.name,
          phone: form.phone,
          email: form.email,
          type: form.type,
          paymentMethod: paymentMethod,
        };
        console.log("Order Payload:", payload);
        orderCourse(payload, {
          onSuccess: async () => {
            await handleGetProfileCourse();
            await handleGetProfilePayment();
            message.success("Đăng ký thành công");
            navigate(PATHS.PROFILE.MY_COURSE);
          },
          onFail: (error) => {
            console.log("Order Fail Error:", error);
            const errorMsg =
              error?.response?.data?.message || "Đăng ký thất bại";
            message.error(errorMsg);
          },
        });
      } else {
        message.error("Vui lòng chọn phương thức thanh toán!");
      }
    }
  };

  // payment
  const [paymentMethod, setPaymentMethod] = useState("");
  const handlePaymentMethod = (payment) => {
    setPaymentMethod(payment);
  };
  return (
    <main className="mainwrapper --ptop">
      <section className="sccourseorder">
        <div className="container small">
          <InfoOrder {...modifiedInfo} />
          <FormOrder ref={formRef} types={tags} disabled={isAlreadyOrder} />
          <PaymentOrder
            handleChange={handlePaymentMethod}
            selectedPayment={paymentMethod}
            disabled={isAlreadyOrder}
          />
          {/* addclass --processing khi bấm đăng ký */}
          <Button
            className="btn btn--primary"
            onClick={_onOrder}
            disabled={isAlreadyOrder}
            loading={orderLoading}
          >
            <span>
              {isAlreadyOrder ? "Đã ký khoá học" : "Đăng ký khoá học"}
            </span>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default CourseOrderPage;
