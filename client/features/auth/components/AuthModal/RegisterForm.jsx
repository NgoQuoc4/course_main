import { MODAL_TYPES } from "@/constants/general";
import PATHS from "@/constants/paths";
import { useAuthContext } from "@/context/AuthContext";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "@/components/Input";
import PageLoading from "@/components/PageLoading";
import Button from "@/components/Button";
import { REGEX } from "@/constants/regex";

const RegisterForm = () => {
  const { handleRegister, handleShowModal, handleCloseModal } =
    useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const register = (registerField) => {
    return {
      name: registerField,
      error: error[registerField],
      value: form[registerField],
      onChange: (e) => setForm({ ...form, [registerField]: e.target.value }),
    };
  };

  const _onSubmit = (e) => {
    e.preventDefault();
    // validate
    const errObj = {};
    if (!!!form.name) {
      errObj.name = "Vui lòng nhập họ và tên";
    }
    if (!!!form.email) {
      errObj.email = "Vui lòng nhập email";
    } else if (!REGEX.email.test(form.email)) {
      errObj.email = "Vui lòng nhập đúng định dạng email";
    }
    if (!!!form.password) {
      errObj.password = "Vui lòng nhập mật khẩu";
    }
    if (!!!form.confirmPassword) {
      errObj.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (form.password && form.confirmPassword !== form.password) {
      errObj.confirmPassword = "Mật khẩu xác nhận không đúng";
    }

    setError(errObj);
    // end validation
    if (Object.keys(errObj).length > 0) {
      console.log("Submit error: ", errObj);
    } else {
      setLoading(true);
      handleRegister({ ...form }, () => {
        setTimeout(() => {
          setLoading(false);
        }, 300);
      });
    }
  };
  return (
    <div
      className="modal__wrapper-content mdregister active"
      style={{ position: "relative" }}
    >
      {loading && <PageLoading />}
      <div className="form__bottom">
        <p>Bạn đã có tài khoản?</p>
        <div
          className="color--primary btnmodal"
          data-modal="mdlogin"
          onClick={() => handleShowModal(MODAL_TYPES.login)}
        >
          <strong>Đăng nhập</strong>
        </div>
      </div>
      <form onSubmit={_onSubmit} className="form">
        <Input
          label="Họ và tên"
          placeholder="Họ và tên"
          required
          {...register("name")}
        />
        <Input
          label="Email"
          placeholder="Email"
          required
          type="email"
          {...register("email")}
        />
        <Input
          label="Mật khẩu"
          placeholder="Mật khẩu"
          required
          type="password"
          {...register("password")}
        />
        <Input
          label="Xác nhận mật khẩu"
          placeholder="Xác nhận mật khẩu"
          required
          type="password"
          {...register("confirmPassword")}
        />
        <p className="form__argee">
          Với việc đăng ký, bạn đã đồng ý{" "}
          <Link
            className="color--primary"
            to={PATHS.PRIVACY}
            onClick={handleCloseModal}
          >
            Chính Sách Điều Khoản
          </Link>{" "}
          của CFD
        </p>
        <Button className="form__btn-register" type="submit">
          Đăng ký tài khoản
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
