import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import PATHS from '@/constants/paths';

const NoPermissionPage = () => {
    const navigate = useNavigate();

    return (
        <Result
            status="403"
            title="403"
            subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
            extra={
                <Button type="primary" onClick={() => navigate(PATHS.HOME)}>
                    Về trang chủ
                </Button>
            }
            style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                backgroundColor: '#fff',
                borderRadius: '8px',
                margin: '24px'
            }}
        />
    );
};

export default NoPermissionPage;
