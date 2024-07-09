import {BrowserRouter,Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ManPage from './pages/ManPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DetailProductPage from './pages/DetailProductPage';


import CartPage from './pages/CartPage';
import { Toaster } from "react-hot-toast";
import LoginAdmin from './pages/admin/AdminLoginPage';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import './App.css';
import DashBoard from './pages/admin/Dashboard';
import CategoryPage from './pages/admin/CategoryPage';
import VariationPage from './pages/admin/VariationPage';
import ProductPage from './pages/admin/ProductPage';
import UserPage from './pages/admin/UserPage';
import WishListPage from './pages/WishListPage';
import ProfilePage from './pages/ProfilePage';
import ConfigPage from './pages/admin/ConfigurationProduct';
import OrderPage from './pages/OrderPage';
import HistoryPage from './pages/HistoryPage';
import OrderDetail from './pages/OrderDetail';
import OrdersAdmin from './pages/admin/OrdersAdmin';
import OrderDetailAdmin from './pages/admin/DetailOrderAdmin';
import SearchPage from './pages/SearchPage';
import ReviewPage from './pages/ReviewPage';
import WomenPage from './pages/WomenPage';
import CouponPage from './pages/admin/Coupon';
import ChangePasswordForgot from './pages/ChangePassword';
import ForgotPassword from './pages/ForgotPassword';
import PaymentSuccess from './pages/payment/paymentSuccess';
import PaymentCancel from './pages/payment/paymentCancel';
import FeedBack from './pages/admin/FeedBack';
import ReviewsByProduct from './pages/ReviewProduct';
import AddressPage from './pages/Address';
import ChangePassword from './pages/PasswordProfile';
import Statistics from './pages/admin/Statistics';




function App() {
  return (
        <div>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage/>}/>
              <Route path="/men" element={<ManPage/>}/>
              <Route path="/women" element={<WomenPage/>}/>
              <Route path='/login' element={<LoginPage/>}/>
              <Route path='/register' element={<RegisterPage/>}/>
              <Route path='/detail/:id' element={<DetailProductPage/>}/>
              <Route path='/profile' element={<ProfilePage/>}/>
              <Route path='/cart' element={<CartPage/>}/>
              <Route path='/wishlist' element={<WishListPage/>}/>
              <Route path='/order' element={<OrderPage/>}/>
              <Route path='/history' element={<HistoryPage/>}/>
              <Route path='/order-detail/:id' element={<OrderDetail/>}/>
              <Route path='/search/:q' name="Search" element={<SearchPage/>}/>
              <Route path='/review/:id' element={<ReviewPage/>}/>
              <Route path='/review/product/:id' element={<ReviewsByProduct/>}/>
              <Route path='/profile/address'  element={<AddressPage/>}/>
              <Route path='/profile/changePassword'  element={<ChangePassword/>}/>

              <Route path='/forgotPassword' element={<ForgotPassword/>}/>
              <Route path='/changePassword' element={<ChangePasswordForgot/>}/>
              <Route path='/payment/success' element={<PaymentSuccess/>}/>
              <Route path='/payment/cancel' element={<PaymentCancel/>}/>


              <Route path='/admin' element={<LoginAdmin/>}/>
              {/* <Route path='/dashboard' element={<DashBoard/>}/> */}
              <Route path='/users' element={<UserPage/>}/>
              <Route path='/product' element={<ProductPage/>}/>
              <Route path='/category' element={<CategoryPage/>}/>
              <Route path='/variation/:id' element={<VariationPage/>} />
              <Route path='/configuration/:id' element={<ConfigPage/>}/>
              <Route path='/orders' element={<OrdersAdmin/>}/>
              <Route path='/orders/:id' element={<OrderDetailAdmin/>}/>
              <Route path='/coupons' element={<CouponPage/>}/>
              <Route path='/feedback' element={<FeedBack/>} />
              <Route path='/statistics' element={<Statistics/>} />

            </Routes>
            <Toaster />
          </BrowserRouter>
        </div>
  );
}

export default App;
