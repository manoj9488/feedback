import React, { useState } from "react";

type FormData = {
  fullName: string;
  organization?: string;
  role: string;
  email: string;
  products: string[];
  relevance: string;
  experienceRating: string;
  impressedMost: string;
  improvements: string;
};

const productsList = ["Product A", "Product B", "Product C", "Product D"];

const FeedbackForm = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "John",
    organization: "InkYank",
    role: "Engineer",
    email: "john@gmail.com",
    products: ["Product B"],
    relevance: "",
    experienceRating: "",
    impressedMost: "Innovations are very good",
    improvements: "Nothing",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState("");

  interface StarRatingProps {
    name: string;
    value: string;
    onChange: (e: React.MouseEvent<HTMLInputElement>) => void;
    required: boolean;
  }

  const StarRating: React.FC<StarRatingProps> = ({
    name,
    value,
    onChange,
    
  }) => {
    const [hover, setHover] = useState(0);
    return (
      <div className="flex space-x-1">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <label key={ratingValue}>
              <input
                type="radio"
                name={name}
                value={ratingValue.toString()}
                onClick={onChange}
                // required={required}
                className="hidden"
              />
              <svg
                className={`cursor-pointer w-6 h-6 ${
                  ratingValue <= (hover || parseInt(value))
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
            </label>
          );
        })}
      </div>
    );
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.MouseEvent<HTMLInputElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;

    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "relevance" || name === "experienceRating") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (type === "checkbox" && name === "products") {
      const checked = target.checked;
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!formData.role.trim()) newErrors.role = "Role is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (formData.products.length === 0)
      newErrors.products = "Please select at least one product.";
    if (!formData.relevance) newErrors.relevance = "Relevance rating is required.";
    if (!formData.experienceRating)
      newErrors.experienceRating = "Experience rating is required.";
    if (!formData.impressedMost.trim())
      newErrors.impressedMost = "Please share what impressed you most.";
    if (!formData.improvements.trim())
      newErrors.improvements = "Please provide improvement suggestions.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitResult("");

    if (!validateForm()) {
      setSubmitting(false);
      return;
    }

    const endpoint = "https://sheetdb.io/api/v1/quv73you8ipiz";

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
        });
      } else {
        setSubmitResult("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error(error);
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Participant Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Participant Info
            </h3>

            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full border-2 ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                } rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
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
                className={`w-full border-2 ${
                  errors.role ? "border-red-500" : "border-gray-300"
                } rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors`}
              />
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full border-2 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Product Interest */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Product Interest
            </h3>

            <div>
              <label className="block text-gray-800 font-semibold mb-3">
                Which product(s) did you explore?{" "}
                <span className="text-red-500">*</span>
              </label>
              <div
                className={`flex flex-wrap gap-4 ${
                  errors.products ? "border-red-500 p-2 rounded-lg" : ""
                }`}
              >
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
              {errors.products && (
                <p className="text-red-500 text-sm mt-1">{errors.products}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-3">
                How relevant do you find this product to your work?{" "}
                <span className="text-red-500">*</span>
              </label>
              <StarRating
                name="relevance"
                value={formData.relevance}
                onChange={handleInputChange}
                required
              />
              {errors.relevance && (
                <p className="text-red-500 text-sm mt-1">{errors.relevance}</p>
              )}
            </div>
          </div>

          {/* Experience Feedback */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Experience Feedback
            </h3>

            <div>
              <label className="block text-gray-800 font-semibold mb-3">
                Overall experience rating:{" "}
                <span className="text-red-500">*</span>
              </label>
              <StarRating
                name="experienceRating"
                value={formData.experienceRating}
                onChange={handleInputChange}
                required
              />
              {errors.experienceRating && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.experienceRating}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                What impressed you most? <span className="text-red-500">*</span>
              </label>
              <textarea
                name="impressedMost"
                placeholder="Share what stood out to you..."
                value={formData.impressedMost}
                onChange={handleInputChange}
                rows={4}
                className={`w-full border-2 ${
                  errors.impressedMost ? "border-red-500" : "border-gray-300"
                } rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors resize-none`}
              />
              {errors.impressedMost && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.impressedMost}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                What could be improved or added?{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="improvements"
                placeholder="Share your suggestions..."
                value={formData.improvements}
                onChange={handleInputChange}
                rows={4}
                className={`w-full border-2 ${
                  errors.improvements ? "border-red-500" : "border-gray-300"
                } rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors resize-none`}
              />
              {errors.improvements && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.improvements}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 shadow-md"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>

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
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
