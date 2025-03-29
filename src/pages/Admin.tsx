import React, { useState, useEffect } from 'react';

const MetricCard = ({ title, value, color, prefix = '' }: { title: string; value: string | number; color: string; prefix?: string }) => (
  <div className={`p-6 rounded-lg shadow-xl ${color} transition-all hover:scale-105 hover:shadow-2xl`}>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-3xl font-bold text-white">
      {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
    </p>
  </div>
);

export const Admin = () => {
  const [salesData, setSalesData] = useState<any>(null);
  const [nthOrder, setNthOrder] = useState(3);
  const [discountPercentage, setDiscountPercentage] = useState(15);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateValidityPercentage = (coupon: any) => {
    if (!coupon.validUntil || !coupon.createdAt) return 0;
    const now = new Date().getTime();
    const start = new Date(coupon.createdAt).getTime();
    const end = new Date(coupon.validUntil).getTime();
    const elapsed = now - start;
    const total = end - start;
    const percentage = (elapsed / total) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  const fetchSalesData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${import.meta.env.VITE_BE_API_URL}/admin/sales-stats`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      const data = await response.json();
      setSalesData(data);
      if (data.threshold) setNthOrder(Number(data.threshold));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSalesData(); }, []);

  const handleSetThreshold = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${import.meta.env.VITE_BE_API_URL}/admin/set-discount-threshold`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ nthOrder }),
      });
      
      await fetchSalesData();
      alert(`Discount threshold set to every ${nthOrder}th order`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGenerateDiscount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${import.meta.env.VITE_BE_API_URL}/admin/generate-discount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          discountPercentage,
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }),
      });
      
      await fetchSalesData();
      alert('Discount code generated successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-white text-center pt-20">Loading...</div>;
  if (error) return <div className="text-red-500 text-center pt-20">{error}</div>;

  return (
    <div className="pt-20 pb-12 bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold text-center my-8 text-white">
        Admin Dashboard
      </h1>

      <div className="px-4 max-w-7xl mx-auto space-y-12">
        {/* Key Metrics Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
              title="Total Sales" 
              value={salesData.overallStats?.totalAmount?.toFixed(2) || 0}
              color="bg-gradient-to-r from-blue-600 to-indigo-500"
              prefix="$"
            />
            <MetricCard
              title="Items Sold"
              value={salesData.overallStats?.itemsCount || 0}
              color="bg-gradient-to-r from-green-600 to-teal-500"
            />
            <MetricCard
              title="Total Discounts"
              value={salesData.overallStats?.totalDiscount?.toFixed(2) || 0}
              color="bg-gradient-to-r from-orange-600 to-red-500"
              prefix="$"
            />
            <MetricCard
              title="Active Codes"
              value={salesData.overallStats?.discountCodes?.length || 0}
              color="bg-gradient-to-r from-purple-600 to-pink-500"
            />
          </div>
        </section>

        {/* Coupon Analytics */}
        <section>
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-semibold mb-6 text-white">Coupon Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Generated Codes</h3>
                  <span className="text-2xl font-bold text-blue-400">
                    {salesData.overallStats?.couponsGenerated || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Redeemed Codes</h3>
                  <span className="text-2xl font-bold text-green-400">
                    {salesData.overallStats?.couponsUsed || 0}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Redemption Rate</h3>
                <div className="relative pt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-blue-400 h-4 rounded-full transition-all duration-500" 
                        style={{ 
                          width: `${(salesData.overallStats?.couponsUsed / salesData.overallStats?.couponsGenerated * 100) || 0}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-white font-medium text-xl">
                      {((salesData.overallStats?.couponsUsed / salesData.overallStats?.couponsGenerated * 100) || 0).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Configuration Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Threshold Configuration */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-white">Discount Threshold</h2>
            <form onSubmit={handleSetThreshold} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-white">Every nth Order</label>
                <input
                  type="number"
                  min="1"
                  value={nthOrder}
                  onChange={(e) => setNthOrder(parseInt(e.target.value) || 1)}
                  className="p-3 rounded-lg bg-gray-700 text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-600 transition-all"
              >
                Set Threshold
              </button>
            </form>
          </div>

          {/* Discount Generation */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-white">Generate Discount Code</h2>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-white">Discount Percentage</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={discountPercentage}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 15;
                    const clamped = Math.max(1, Math.min(100, value));
                    setDiscountPercentage(clamped);
                  }}
                  className="p-3 rounded-lg bg-gray-700 text-white"
                />
              </div>
              <button
                onClick={handleGenerateDiscount}
                className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-600 transition-all"
              >
                Generate Code
              </button>
            </div>
          </div>
        </section>

        {/* Active Discount Codes */}
        {salesData?.overallStats?.discountCodes?.length > 0 && (
          <section className="bg-gray-800 p-6 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-white">Active Discount Codes</h2>
            <div className="space-y-4">
              {salesData.overallStats.discountCodes.map((coupon: any) => (
                <div key={coupon.code} className="p-4 bg-gray-700 rounded-lg shadow-md">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-white text-lg">{coupon.code}</span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        coupon.used ? 'bg-red-600' : 'bg-green-600'
                      }`}>
                        {coupon.used ? 'Redeemed' : 'Active'}
                      </span>
                    </div>
                    <span className="text-white font-bold">
                      {coupon.percentage}%
                    </span>
                  </div>
                  
                  {!coupon.used && coupon.validUntil && (
                    <div className="relative pt-2">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Valid until: {new Date(coupon.validUntil).toLocaleDateString()}</span>
                        <span>{Math.round(calculateValidityPercentage(coupon))}% elapsed</span>
                      </div>
                      <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-2 bg-blue-500 rounded-full transition-all"
                          style={{ width: `${calculateValidityPercentage(coupon)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};