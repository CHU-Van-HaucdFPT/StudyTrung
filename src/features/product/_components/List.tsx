import React, { useState } from 'react';
import { IProduct } from '@/common/Type';
import { useProductMutation } from '@/hooks/useProductMutation';
import { useProductQuery } from '@/hooks/useProductQuery';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { useToast } from '../../../components/ui/use-toast';
import { getColumns } from './Columns';
import { DataTable } from './DataTable';

const List = () => {
    const { toast } = useToast();
    const { isLoading, isError, data } = useProductQuery();
    const [currentIndex, setCurrentIndex] = useState(0); // Quản lý trạng thái chỉ mục của sản phẩm hiện tại
    const { onRemove } = useProductMutation({
        action: 'DELETE',
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Xóa sản phẩm thành công',
                variant: 'success',
            });
        },
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error...</div>;

    const products = data as IProduct[]; // Danh sách sản phẩm
    const currentProduct = [products[currentIndex]]; // Chỉ hiển thị sản phẩm hiện tại dưới dạng mảng (DataTable yêu cầu mảng)

    const columns = getColumns(onRemove);

    // Hàm xử lý "Trở về trước"
    const handlePrevious = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    // Hàm xử lý "Chuyển tiếp"
    const handleNext = () => {
        if (currentIndex < products.length - 1) setCurrentIndex(currentIndex + 1);
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <h2>Quản lý sản phẩm</h2>
                <Link to="/admin/products/add">
                    <Button variant="link">
                        <PlusCircle />
                        Thêm sản phẩm
                    </Button>
                </Link>
            </div>

            {/* DataTable hiển thị sản phẩm hiện tại */}
            <div className="mt-4">
                <DataTable columns={columns} data={currentProduct} />
            </div>

            {/* Điều hướng */}
            <div className="flex justify-between mt-4">
                <Button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className={`px-4 py-2 ${currentIndex === 0 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
                >
                    Trở về trước
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={currentIndex === products.length - 1}
                    className={`px-4 py-2 ${currentIndex === products.length - 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
                >
                    Chuyển tiếp
                </Button>
            </div>
        </div>
    );
};

export default List;
