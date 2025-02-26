import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Camera, Plus, QrCode, Save, Trash2, Upload } from 'lucide-react';
import type { MenuItem, Restaurant } from './types';

function App() {
  const [restaurant, setRestaurant] = useState<Restaurant>({
    name: '',
    logoUrl: '',
  });
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [showQR, setShowQR] = useState(false);

  const handleAddMenuItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      title: '',
      description: '',
      price: 0,
      imageUrl: '',
    };
    setMenuItems([...menuItems, newItem]);
  };

  const handleUpdateMenuItem = (id: string, field: keyof MenuItem, value: string | number) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateMenuItem(id, 'imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRestaurant({ ...restaurant, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateMenuHTML = () => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${restaurant.name} - Menu</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            background-color: #f9fafb;
          }
          .menu-item {
            transition: transform 0.2s;
          }
          .menu-item:hover {
            transform: translateY(-2px);
          }
          .price {
            color: #059669;
            font-weight: 600;
          }
        </style>
      </head>
      <body class="min-h-screen bg-gray-50">
        <div class="max-w-4xl mx-auto p-6">
          <header class="text-center mb-12">
            ${restaurant.logoUrl ? 
              `<img src="${restaurant.logoUrl}" alt="${restaurant.name}" class="h-24 mx-auto mb-4 rounded-lg shadow-sm">` 
              : ''
            }
            <h1 class="text-4xl font-bold text-gray-900 mb-2">${restaurant.name}</h1>
            <div class="w-20 h-1 bg-green-500 mx-auto"></div>
          </header>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${menuItems.map(item => `
              <div class="menu-item bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md">
                ${item.imageUrl ? 
                  `<img src="${item.imageUrl}" alt="${item.title}" class="w-full h-48 object-cover">` 
                  : ''
                }
                <div class="p-6">
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-semibold text-gray-900">${item.title}</h3>
                    <span class="price text-2xl">₹${item.price}</span>
                  </div>
                  <p class="text-gray-600 text-sm">${item.description}</p>
                </div>
              </div>
            `).join('')}
          </div>

          <footer class="text-center mt-12 text-sm text-gray-500">
            <p>Menu powered by QRMenu Instant</p>
          </footer>
        </div>

        <script>
          // Add smooth scroll behavior
          document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
              e.preventDefault();
              document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
              });
            });
          });

          // Add fade-in animation for menu items
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
              }
            });
          }, { threshold: 0.1 });

          document.querySelectorAll('.menu-item').forEach((item) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(item);
          });
        </script>
      </body>
      </html>
    `;
  };

  const handleGenerateMenu = () => {
    setShowQR(true);
    // Save the menu HTML to a file that will be deployed
    const menuHtml = generateMenuHTML();
    localStorage.setItem('qrmenu-content', menuHtml);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">QRMenu Instant</h1>
        
        {/* Restaurant Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Restaurant Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
              <input
                type="text"
                value={restaurant.name}
                onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter restaurant name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Logo</label>
              <div className="mt-1 flex items-center">
                {restaurant.logoUrl && (
                  <img src={restaurant.logoUrl} alt="Logo" className="h-12 w-12 object-cover mr-4" />
                )}
                <label className="cursor-pointer bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50">
                  <Upload className="inline-block w-5 h-5 mr-2" />
                  Upload Logo
                  <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Menu Items</h2>
            <button
              onClick={handleAddMenuItem}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Item
            </button>
          </div>

          <div className="space-y-6">
            {menuItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateMenuItem(item.id, 'title', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Item name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                    <input
                      type="number"
                      value={item.price || ''}
                      onChange={(e) => handleUpdateMenuItem(item.id, 'price', e.target.value ? parseFloat(e.target.value) : 0)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={item.description}
                      onChange={(e) => handleUpdateMenuItem(item.id, 'description', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={2}
                      placeholder="Item description"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <div className="mt-1 flex items-center">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.title} className="h-12 w-12 object-cover mr-4" />
                      )}
                      <label className="cursor-pointer bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50">
                        <Camera className="inline-block w-5 h-5 mr-2" />
                        Upload Image
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, item.id)}
                          accept="image/*"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteMenuItem(item.id)}
                  className="mt-4 text-red-600 hover:text-red-700 flex items-center"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Delete Item
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Generate QR Code */}
        <div className="text-center">
          <button
            onClick={handleGenerateMenu}
            className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 flex items-center mx-auto"
            disabled={!restaurant.name || menuItems.length === 0}
          >
            <QrCode className="w-5 h-5 mr-2" />
            Generate QR Menu
          </button>
        </div>

        {/* QR Code Modal */}
        {showQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-2xl font-semibold mb-4">Your QR Menu</h3>
              <div className="flex justify-center mb-4">
                <QRCodeSVG
                  value={window.location.href}
                  size={200}
                  level="M"
                  includeMargin={true}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowQR(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([generateMenuHTML()], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'menu.html';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Download Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;