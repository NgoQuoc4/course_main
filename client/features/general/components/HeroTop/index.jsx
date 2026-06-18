import { formatCurrency } from '@/utils/format'
import React, { useEffect } from 'react'
import Button from '@/components/Button'

const HeroTop = ({ id, image, thumbnail, name, teacherInfo = {}, price, orderLink, isRegistered }) => {
    const displayImage = image || thumbnail || "/img/default-course.jpg";
    
    useEffect(() => {

        function showHeadCourseDetail() {
            let buttonRegister = $('.herodetail .btn');
            if (buttonRegister.length) {
                let headtop = $('.headtop');
                let headProgress = $('.headtop__progress');
                let offsetHead = buttonRegister.offset().top;
                let pageHeight = $(document).height() - $(window).height();
                let scrollTop = $(window).scrollTop(); // y

                let progress = scrollTop / pageHeight * 100;

                if (offsetHead <= scrollTop) {
                    headtop.addClass('show');
                } else {
                    headtop.removeClass('show');
                }
                headProgress.css({
                    width: progress + '%'
                });
            }
        }
        function coursePage() {
            if ($('.coursedetailpage').length) {
                showHeadCourseDetail();
                $(window).on('scroll', function () {
                    showHeadCourseDetail();
                });
            }
        }
        coursePage();

    }, [id]);

    const teacherName = teacherInfo.firstName ? `${teacherInfo.firstName} ${teacherInfo.lastName || ""}`.trim() : (teacherInfo.name || "Teacher");

    return (
        <div className="headtop">
            <div className="container-fluid">
                <div className="headtop__left">
                    <div className="headtop__left-avatar">
                        <img src={displayImage} alt="" />
                    </div>
                    <div className="headtop__left-title">
                        <h2><strong>{name}</strong></h2>
                        <p>{teacherName}</p>
                    </div>
                </div>
                <div className="headtop__right">
                    <div className="headtop__right-price">
                        <strong>{formatCurrency(price) + " VND"}</strong>
                    </div>
                    {isRegistered ? (
                        <div className="btn btn--primary btn-regcourse --disable">Đã đăng ký</div>
                    ) : (
                        <Button link={orderLink} className="btn btn--primary btn-regcourse">đăng ký học</Button>
                    )}
                </div>
            </div>
            <div className="headtop__progress" />
        </div>

    )
}

export default HeroTop
