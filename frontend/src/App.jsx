import { useState } from "react";
import "./index.css";
import { Button } from "./components/ui/button"; 
import { Input } from "./components/ui/input";  
import { Label } from "./components/ui/label"; 
import { Card, CardContent, CardHeader } from "./components/ui/card"; 
import {
  Building,
  Search,
  MessageCircle,
  Lightbulb,
  RefreshCw,
  BarChart3,
  MapPin,
  Clock,
  UserCircle,
  TrendingUp,
} from "lucide-react";

function App() {

  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });
  const [businessData, setBusinessData] = useState(null);
  const [currentBusiness, setCurrentBusiness] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * @param {Object} e
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /**
   * @returns {boolean}
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Business name is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * @param {Object} e 
   */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; 
    }

    setIsLoading(true); 
    setErrors({});

    try {
      const response = await fetch("/api/business-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          location: formData.location.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to analyze business");
      }

      const data = await response.json();
      setBusinessData(data);
      setCurrentBusiness({
        name: formData.name.trim(),
        location: formData.location.trim(),
      });
    } catch (error) {
      console.error("Error submitting business data:", error);
      setErrors({ submit: error.message }); 
    } finally {
      setIsLoading(false); 
    }
  };

  const handleRegenerate = async () => {
    if (!currentBusiness) return;

    setIsRegenerating(true);
    setErrors({});

    try {
      const response = await fetch(
        `/api/regenerate-headline?name=${encodeURIComponent(currentBusiness.name)}&location=${encodeURIComponent(currentBusiness.location)}`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to regenerate headline");
      }

      const data = await response.json();
      setBusinessData((prev) => ({
        ...prev,
        headline: data.headline,
      }));
    } catch (error) {
      console.error("Error regenerating headline:", error);
      setErrors({ regenerate: error.message });
    } finally {
      setIsRegenerating(false);
    }
  };

  /**
   * @param {number} rating 
   * @returns {JSX.Element}
   */
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0; 
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex text-yellow-400">
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <Star key={`full-${i}`} className="w-4 h-4 fill-current" />
          ))}
        {hasHalfStar && <Star key="half" className="w-4 h-4 fill-current opacity-50" />}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <Star key={`empty-${i}`} className="w-4 h-4" />
          ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-inter"> 
      <header className="bg-white border-b border-slate-200 px-4 py-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                <TrendingUp className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-semibold text-slate-800">
                Business Dashboard
              </h1>
            </div>
            <div className="text-sm text-slate-500 flex items-center">
              <UserCircle className="w-4 h-4 mr-2 text-slate-400" />
              <span>Admin User</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <Card className="shadow-lg rounded-xl border-slate-200">
              <CardHeader className="pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Building className="text-blue-500 w-5 h-5" />
                  <h2 className="text-lg font-semibold text-slate-800">
                    Business Information
                  </h2>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-slate-700"
                    >
                      Business Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Cake & Co"
                      className="mt-2 border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="location"
                      className="text-sm font-medium text-slate-700"
                    >
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Mumbai"
                      className="mt-2 border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.location}
                      </p>
                    )}
                  </div>

                  {errors.submit && (
                    <p className="text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.submit}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Analyze Business
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {isLoading && (
              <Card className="shadow-lg mt-6 rounded-xl border-slate-200 animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-6 h-6 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded flex-1"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-8 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-8">
            {businessData && currentBusiness ? (
              <Card className="shadow-lg rounded-xl border-slate-200">
                <CardHeader className="pb-4 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="text-emerald-500 w-5 h-5" />
                      <h2 className="text-lg font-semibold text-slate-800">
                        Business Analysis
                      </h2>
                    </div>
                    <div className="text-sm text-slate-500 flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-slate-400" />
                      <span>Updated just now</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-100">
                    <h3 className="text-xl font-semibold text-slate-800 mb-1">
                      {currentBusiness.name}
                    </h3>
                    <p className="text-slate-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                      {currentBusiness.location}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-emerald-700 mb-1">
                            Google Rating
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-emerald-800">
                              {businessData.rating}
                            </span>
                            {renderStars(businessData.rating)}
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center">
                          <Star className="text-emerald-600 w-6 h-6" />
                        </div>
                      </div>
                    </div>

                    {/* Reviews Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-700 mb-1">
                            Total Reviews
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-blue-800">
                              {businessData.reviews}
                            </span>
                            <span className="text-sm text-blue-600">
                              reviews
                            </span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                          <MessageCircle className="text-blue-600 w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-slate-800 flex items-center">
                        <Lightbulb className="text-yellow-500 w-5 h-5 mr-2" />
                        AI-Generated SEO Headline
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRegenerate}
                        disabled={isRegenerating}
                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 transition duration-200 ease-in-out"
                      >
                        {isRegenerating ? (
                          <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4 mr-1" />
                        )}
                        <span>Regenerate</span>
                      </Button>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                      <p className="text-slate-800 text-lg leading-relaxed font-medium">
                        "{businessData.headline}"
                      </p>
                    </div>

                    <div className="mt-3 text-sm text-slate-500 flex items-center">
                      <span className="mr-2">🤖</span>
                      <span>Generated by AI • Optimized for local SEO</span>
                    </div>

                    {errors.regenerate && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.regenerate}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg rounded-xl border-slate-200">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="text-2xl text-slate-400 w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    No Business Data Yet
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Enter your business information to get started with
                    analytics and SEO insights.
                  </p>
                  <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
                    <div className="flex items-center">
                      <Star className="text-yellow-400 w-4 h-4 mr-2" />
                      <span>Google Ratings</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="text-blue-400 w-4 h-4 mr-2" />
                      <span>Review Count</span>
                    </div>
                    <div className="flex items-center">
                      <Lightbulb className="text-yellow-400 w-4 h-4 mr-2" />
                      <span>SEO Headlines</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-white border-t border-slate-200 mt-12 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              © 2025 Business Dashboard. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <span>API Status: Connected</span>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
