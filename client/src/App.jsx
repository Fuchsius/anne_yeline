import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AboutPage } from './pages/AboutPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { ProductFormPage } from './pages/admin/ProductFormPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { ROUTES } from './constants/routes';
import { ConnectionStatus } from './components/common/ConnectionStatus';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { BackendStatusProvider } from './context/BackendStatusProvider';
import { MaintenanceOverlay } from './components/common/MaintenanceOverlay';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { CartProvider } from './context/CartContext';
import { CartSidebar } from './components/cart/CartSidebar';
import './App.css';

function App() {
  return (
    <BackendStatusProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <ThemeProvider>
              <ErrorBoundary>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <CartSidebar />
                  <main className="flex-grow">
                    <Routes>
                      {/* Public Routes */}
                      <Route path={ROUTES.HOME} element={<HomePage />} />
                      <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
                      <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
                      <Route path={ROUTES.CATEGORIES} element={<CategoriesPage />} />
                      <Route path={ROUTES.CATEGORY_DETAIL} element={<CategoryDetailPage />} />
                      <Route path={ROUTES.ABOUT} element={<AboutPage />} />
                      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                      
                      {/* Protected Routes */}
                      <Route 
                        path={ROUTES.PROFILE} 
                        element={
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Admin Routes */}
                      <Route 
                        path={ROUTES.ADMIN.DASHBOARD} 
                        element={
                          <ProtectedRoute adminOnly>
                            <AdminDashboard />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path={ROUTES.ADMIN.PRODUCTS} 
                        element={
                          <ProtectedRoute adminOnly>
                            <AdminProductsPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path={`${ROUTES.ADMIN.PRODUCTS}/add`} 
                        element={
                          <ProtectedRoute adminOnly>
                            <ProductFormPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path={`${ROUTES.ADMIN.PRODUCTS}/edit/:id`} 
                        element={
                          <ProtectedRoute adminOnly>
                            <ProductFormPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path={ROUTES.ADMIN.CATEGORIES} 
                        element={
                          <ProtectedRoute adminOnly>
                            <AdminCategoriesPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path={ROUTES.ADMIN.ORDERS} 
                        element={
                          <ProtectedRoute adminOnly>
                            <AdminOrdersPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path={ROUTES.ADMIN.USERS} 
                        element={
                          <ProtectedRoute adminOnly>
                            <AdminUsersPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path={ROUTES.CHECKOUT} 
                        element={
                          <ProtectedRoute>
                            <CheckoutPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path={ROUTES.ORDERS} 
                        element={
                          <ProtectedRoute>
                            <OrdersPage />
                          </ProtectedRoute>
                        } 
                      />
                    </Routes>
                  </main>
                  <Footer />
                  <ConnectionStatus />
                  <MaintenanceOverlay />
                </div>
              </ErrorBoundary>
            </ThemeProvider>
          </Router>
        </CartProvider>
      </AuthProvider>
    </BackendStatusProvider>
  );
}

export default App;