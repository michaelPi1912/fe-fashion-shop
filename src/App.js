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




function App() {
  return (
        <div>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage/>}/>
              <Route path="/man" element={<ManPage/>}/>
              <Route path='/login' element={<LoginPage/>}/>
              <Route path='/register' element={<RegisterPage/>}/>
              <Route path='/detail/:id' element={<DetailProductPage/>}/>
              <Route path='/profile' element={<ProfilePage/>}/>
              <Route path='/cart' element={<CartPage/>}/>
              <Route path='/wishlist' element={<WishListPage/>}/>

              <Route path='/admin' element={<LoginAdmin/>}/>
              <Route path='/dashboard' element={<DashBoard/>}/>
              <Route path='/users' element={<UserPage/>}/>
              <Route path='/product' element={<ProductPage/>}/>
              <Route path='/category' element={<CategoryPage/>}/>
              <Route path='/variation/:id' element={<VariationPage/>} />
              <Route path='/configuration/:id' element={<ConfigPage/>}/>
            </Routes>
            <Toaster />
          </BrowserRouter>
        </div>
  );
}

export default App;
