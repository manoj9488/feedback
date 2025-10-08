import React, { useState } from "react";

type FormData = {
  fullName: string;
  organization: string;
  role: string;
  email: string;
  products: string[];
  relevance: string;
  experienceRating: string;
  impressedMost: string;
  improvements: string;
  category: string;
  demoAttended: string;
};

const productsList = ["Product A", "Product B", "Product C", "Product D"];

const FeedbackForm = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    organization: "",
    role: "",
    email: "",
    products: [],
    relevance: "",
    experienceRating: "",
    impressedMost: "",
    improvements: "",
    category: "",
    demoAttended: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox" && name === "products") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => {
        let newProducts = [...prev.products];
        if (checked) {
          newProducts.push(value);
        } else {
          newProducts = newProducts.filter((p) => p !== value);
        }
        return { ...prev, products: newProducts };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitResult("");

    const endpoint = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

    const payload = {
      fullName: formData.fullName,
      organization: formData.organization,
      role: formData.role,
      email: formData.email,
      products: formData.products.join(", "),
      relevance: formData.relevance,
      experienceRating: formData.experienceRating,
      impressedMost: formData.impressedMost,
      improvements: formData.improvements,
      category: formData.category,
      demoAttended: formData.demoAttended,
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitResult("Thank you for your feedback!");
        setFormData({
          fullName: "",
          organization: "",
          role: "",
          email: "",
          products: [],
          relevance: "",
          experienceRating: "",
          impressedMost: "",
          improvements: "",
          category: "",
          demoAttended: "",
        });
      } else {
        setSubmitResult("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.log(error);
      setSubmitResult("Error submitting the form. Please try again later.");
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">
          Feedback Form
        </h2>

        <div className="space-y-8">
          {/* Section 1: Participant Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Participant Info
            </h3>

            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Organization / Company Name
              </label>
              <input
                type="text"
                name="organization"
                placeholder="Enter your organization"
                value={formData.organization}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Role / Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="role"
                placeholder="e.g., Engineer, Product Manager, Founder"
                value={formData.role}
                onChange={handleInputChange}
                required
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Section 2: Product Interest */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Product Interest
            </h3>

            <div>
              <label className="block text-gray-800 font-semibold mb-3">
                Which product(s) did you explore?
              </label>
              <div className="flex flex-wrap gap-4">
                {productsList.map((product) => (
                  <label
                    key={product}
                    className="inline-flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="products"
                      value={product}
                      checked={formData.products.includes(product)}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{product}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-3">
                How relevant do you find this product to your work?{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <label
                    key={num}
                    className="inline-flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="relevance"
                      value={num.toString()}
                      checked={formData.relevance === num.toString()}
                      onChange={handleInputChange}
                      required
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 font-medium">{num}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Experience Feedback */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Experience Feedback
            </h3>

            <div>
              <label className="block text-gray-800 font-semibold mb-3">
                Overall experience rating:{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <label
                    key={num}
                    className="inline-flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="experienceRating"
                      value={num.toString()}
                      checked={formData.experienceRating === num.toString()}
                      onChange={handleInputChange}
                      required
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 font-medium">{num}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                What impressed you most?
              </label>
              <textarea
                name="impressedMost"
                placeholder="Share what stood out to you..."
                value={formData.impressedMost}
                onChange={handleInputChange}
                rows={4}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                What could be improved or added?
              </label>
              <textarea
                name="improvements"
                placeholder="Share your suggestions..."
                value={formData.improvements}
                onChange={handleInputChange}
                rows={4}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 shadow-md"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>

          {/* Submission feedback */}
          {submitResult && (
            <p
              className={`text-center mt-4 font-medium ${
                submitResult.includes("Thank")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {submitResult}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
