import { useState, useEffect } from 'react';

function PromoCodes() {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromotions, setAppliedPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch applied promotions from backend
  useEffect(() => {
    const fetchAppliedPromotions = async () => {
      setIsLoading(true);
      try {
        // const response = await fetch('/api/promotions/applied');
        // const data = await response.json();
        // setAppliedPromotions(data);

        // Mock data for demonstration
        setAppliedPromotions([
          { code: 'SUMMER20', discount: '20% off', validUntil: '2023-08-31' },
          { code: 'WELCOME10', discount: '10% off first booking', validUntil: '2023-12-31' }
        ]);
      } catch (err) {
        setError('Failed to load promotions');
        console.error('Error fetching promotions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppliedPromotions();
  }, []);

  // Apply promo code
  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      setError('Please enter a promo code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // const response = await fetch('/api/promotions/apply', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ code: promoCode })
      // });

      // const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.message || 'Failed to apply promo code');
      // }

      // Mock response for demonstration
      const mockResponse = {
        code: promoCode.toUpperCase(),
        discount: '15% off',
        validUntil: '2023-09-30',
        message: 'Promo code applied successfully!'
      };

      // Check if promo code is already applied
      if (appliedPromotions.some(promo => promo.code === mockResponse.code)) {
        setError('This promo code is already applied');
        return;
      }

      setAppliedPromotions(prev => [...prev, mockResponse]);
      setPromoCode('');
    } catch (err) {
      setError(err.message || 'Failed to apply promo code');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove promo code
  const handleRemovePromoCode = async (codeToRemove) => {
    try {
      // await fetch('/api/promotions/remove', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ code: codeToRemove })
      // });

      setAppliedPromotions(prev =>
        prev.filter(promo => promo.code !== codeToRemove)
      );
    } catch (err) {
      setError('Failed to remove promo code');
      console.error('Error removing promo code:', err);
    }
  };

  // Format applied promotions for display
  const formatAppliedPromotions = () => {
    if (appliedPromotions.length === 0) {
      return 'No promotions applied yet.';
    }

    return appliedPromotions
      .map(promo =>
        `${promo.code} - ${promo.discount} (Valid until ${promo.validUntil})`
      )
      .join('\n\n');
  };

  return (
    <div className="flex flex-col gap-6 md:gap-[50px] w-full p-4 md:px-[20px]">
      {/* Header and Promo Code Input */}
      <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-[50px]">
        <h3 className="text-lg md:text-xl font-medium whitespace-nowrap">
          Promo Codes
        </h3>

        <div className="flex flex-col w-full md:w-auto gap-2">
          <div className="flex items-center gap-2 md:gap-[10px] w-full md:w-[400px] h-12 md:h-[60px] bg-white rounded-md md:rounded-[5px] shadow-sm md:shadow-[0px_0px_4px_0px_#00000040] p-2 md:p-[8px]">
            <input
              className="w-full h-full bg-[#F5F5F5] px-3 md:px-4 rounded focus:outline-none focus:ring-1 focus:ring-[#16457E]"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter promo code"
              disabled={isLoading}
            />
            <button
              onClick={handleApplyPromoCode}
              className="text-sm md:text-base text-[#16457E] font-medium whitespace-nowrap px-3 py-1 md:px-4 md:py-2 hover:bg-[#16457E] hover:text-white rounded transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Applying...' : 'Apply'}
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>
      </div>

      {/* Applied Promotions */}
      <div className="w-full">
        <label className="text-lg md:text-xl font-medium flex flex-col gap-4 md:gap-[20px]">
          Applied Promotions

          <div className="relative">
            <textarea
              className="w-full p-4 bg-white rounded-md md:rounded-[5px] focus:outline-none focus:ring-1 focus:ring-[#16457E] shadow-sm md:shadow-[0px_0px_4px_0px_#00000040]"
              rows={4}
              value={formatAppliedPromotions()}
              readOnly
            />

            {appliedPromotions.length > 0 && (
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {appliedPromotions.map((promo) => (
                  <button
                    key={promo.code}
                    onClick={() => handleRemovePromoCode(promo.code)}
                    className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                    title="Remove promo code"
                  >
                    Remove
                  </button>
                ))}
              </div>
            )}
          </div>
        </label>
      </div>
    </div>
  );
}

export default PromoCodes;