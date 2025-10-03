import { useState } from "react";
import api from "../../api";

export default function PincodeCheck({ value, onChange, onShippingCostChange }) {
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState(null);
  const checkPincode = async (pincode) => {
    if (pincode.length !== 6) return;

    setChecking(true);
    setStatus(null);

    try {
      const {data} = await api.get(
        `pincode-check/${pincode}`
      );
      if (data[0]?.total_amount > 0) {
        setStatus("✅ Service available");
        onShippingCostChange(data[0]?.total_amount);
      } else {
        setStatus("❌ Not serviceable");
        onShippingCostChange(-1);
      }
    } catch (err) {
      console.error("Pincode check error:", err);
      setStatus("⚠️ Error checking pincode");
      onShippingCostChange(-1);
    }

    setChecking(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
      <input
        type="text"
        name="pincode"
        required
        value={value}
        placeholder="Enter pincode"
        onChange={(e) => {
          onChange(e); // update parent state
          if (e.target.value.length === 6) {
            checkPincode(e.target.value);
          }
        }}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
      />

      {checking && <p className="text-sm text-gray-500 mt-1">Checking...</p>}
      {status && <p className="text-sm mt-1">{status}</p>}
    </div>
  );
}
