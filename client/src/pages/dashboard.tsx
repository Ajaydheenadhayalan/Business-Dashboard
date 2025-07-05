import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { businessSubmissionSchema, type BusinessSubmission } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Building, Search, Star, MessageCircle, Lightbulb, RefreshCw, BarChart3, MapPin, Clock, UserCircle, TrendingUp } from "lucide-react";

interface BusinessData {
  rating: number;
  reviews: number;
  headline: string;
}

export default function Dashboard() {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [currentBusiness, setCurrentBusiness] = useState<{ name: string; location: string } | null>(null);
  const { toast } = useToast();

  const form = useForm<BusinessSubmission>({
    resolver: zodResolver(businessSubmissionSchema),
    defaultValues: {
      name: "",
      location: "",
    },
  });

  const submitBusinessMutation = useMutation({
    mutationFn: async (data: BusinessSubmission) => {
      const response = await apiRequest("POST", "/api/business-data", data);
      return response.json();
    },
    onSuccess: (data: BusinessData) => {
      setBusinessData(data);
      setCurrentBusiness({
        name: form.getValues("name"),
        location: form.getValues("location"),
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to analyze business",
        variant: "destructive",
      });
    },
  });

  const regenerateHeadlineMutation = useMutation({
    mutationFn: async () => {
      if (!currentBusiness) throw new Error("No business data available");
      const response = await apiRequest("POST", "/api/regenerate-headline", currentBusiness);
      return response.json();
    },
    onSuccess: (data: { headline: string }) => {
      if (businessData) {
        setBusinessData({ ...businessData, headline: data.headline });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to regenerate headline",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BusinessSubmission) => {
    submitBusinessMutation.mutate(data);
  };

  const handleRegenerate = () => {
    regenerateHeadlineMutation.mutate();
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex text-yellow-400">
        {Array(fullStars).fill(0).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-current" />
        ))}
        {hasHalfStar && <Star className="w-4 h-4 fill-current opacity-50" />}
        {Array(emptyStars).fill(0).map((_, i) => (
          <Star key={i} className="w-4 h-4" />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-semibold text-slate-800">Business Dashboard</h1>
            </div>
            <div className="text-sm text-slate-500 flex items-center">
              <UserCircle className="w-4 h-4 mr-2" />
              <span>Admin User</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Business Form */}
          <div className="lg:col-span-4">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-2">
                  <Building className="text-blue-500 w-5 h-5" />
                  <h2 className="text-lg font-semibold text-slate-800">Business Information</h2>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                      Business Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      {...form.register("name")}
                      placeholder="Enter your business name"
                      className="mt-2"
                    />
                    {form.formState.errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠</span>
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="location" className="text-sm font-medium text-slate-700">
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      {...form.register("location")}
                      placeholder="Enter your business location"
                      className="mt-2"
                    />
                    {form.formState.errors.location && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠</span>
                        {form.formState.errors.location.message}
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={submitBusinessMutation.isPending}
                  >
                    {submitBusinessMutation.isPending ? (
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
            
            {/* Loading State */}
            {submitBusinessMutation.isPending && (
              <Card className="shadow-sm mt-6">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-6 h-6 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded animate-pulse flex-1"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-8 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Business Results */}
          <div className="lg:col-span-8">
            {businessData && currentBusiness ? (
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="text-emerald-500 w-5 h-5" />
                      <h2 className="text-lg font-semibold text-slate-800">Business Analysis</h2>
                    </div>
                    <div className="text-sm text-slate-500 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Updated just now</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Business Header */}
                  <div className="bg-slate-50 rounded-lg p-4 mb-6">
                    <h3 className="text-xl font-semibold text-slate-800 mb-1">
                      {currentBusiness.name}
                    </h3>
                    <p className="text-slate-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                      {currentBusiness.location}
                    </p>
                  </div>
                  
                  {/* Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    {/* Rating Card */}
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-emerald-700 mb-1">Google Rating</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-emerald-800">{businessData.rating}</span>
                            {renderStars(businessData.rating)}
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center">
                          <Star className="text-emerald-600 w-6 h-6" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Reviews Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-700 mb-1">Total Reviews</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-blue-800">{businessData.reviews}</span>
                            <span className="text-sm text-blue-600">reviews</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                          <MessageCircle className="text-blue-600 w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* SEO Headline Section */}
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
                        disabled={regenerateHeadlineMutation.isPending}
                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                      >
                        {regenerateHeadlineMutation.isPending ? (
                          <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4 mr-1" />
                        )}
                        <span>Regenerate</span>
                      </Button>
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-slate-800 text-lg leading-relaxed">
                        "{businessData.headline}"
                      </p>
                    </div>
                    
                    <div className="mt-3 text-sm text-slate-500 flex items-center">
                      <span className="mr-2">🤖</span>
                      <span>Generated by AI • Optimized for local SEO</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Empty State */
              <Card className="shadow-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="text-2xl text-slate-400 w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">No Business Data Yet</h3>
                  <p className="text-slate-600 mb-4">Enter your business information to get started with analytics and SEO insights.</p>
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

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              © 2025 Business Dashboard. Built with React & Tailwind CSS.
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
