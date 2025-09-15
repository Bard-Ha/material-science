import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Check, Crown, Zap, Building, Smartphone, CreditCard, Clock } from "lucide-react";
import { type SubscriptionPlan } from "@shared/schema";
// Removed unused import
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SubscriptionDialogProps {
  children: React.ReactNode;
  user?: any;
}

interface PaymentInstructions {
  shortCode?: string;
  appName?: string;
  steps: string[];
  estimatedTime: string;
  supportPhone: string;
  error?: string;
  supportedMethods?: string[];
}

export default function SubscriptionDialog({ children, user }: SubscriptionDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [paymentInstructions, setPaymentInstructions] = useState<PaymentInstructions | null>(null);
  const [transactionId, setTransactionId] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: plansData, isLoading } = useQuery<{ success: boolean; plans: SubscriptionPlan[] }>({
    queryKey: ["/api/subscription-plans"],
  });

  const paymentMutation = useMutation({
    mutationFn: async ({ planId, paymentMethod }: { planId: string; paymentMethod: string }) => {
      const response = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          planId,
          paymentMethod,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Payment initiation failed");
      }
      return result;
    },
    onSuccess: (data) => {
      setPaymentInstructions(data.paymentInstructions);
      setTransactionId(data.transaction.id);
      toast({
        title: "Payment initiated",
        description: "Please follow the instructions to complete your payment.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Payment failed",
        description: error.message || "Failed to initiate payment.",
        variant: "destructive",
      });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (transactionId: string) => {
      const response = await fetch(`/api/payments/verify/${transactionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Payment verification failed");
      }
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: "Payment successful!",
        description: data.message,
      });
      setOpen(false);
      setSelectedPlan(null);
      setPaymentInstructions(null);
      queryClient.invalidateQueries();
      // Update user in localStorage
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...userData, subscriptionTier: selectedPlan?.name.toLowerCase() }));
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: "Payment verification failed",
        description: error.message || "Failed to verify payment.",
        variant: "destructive",
      });
    },
  });

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe to a plan.",
        variant: "destructive",
      });
      return;
    }
    setSelectedPlan(plan);
  };

  const handlePaymentSubmit = () => {
    if (!selectedPlan || !paymentMethod) return;
    paymentMutation.mutate({ planId: selectedPlan.id, paymentMethod });
  };

  const handleVerifyPayment = () => {
    if (!transactionId) return;
    verifyMutation.mutate(transactionId);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "telebirr":
        return "🇪🇹";
      case "mpesa":
        return "📱";
      case "cbe":
        return "🏦";
      case "abyssinia":
        return "🏛️";
      default:
        return "💳";
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "basic":
        return <Zap className="h-6 w-6" />;
      case "professional":
        return <Crown className="h-6 w-6" />;
      case "enterprise":
        return <Building className="h-6 w-6" />;
      default:
        return <Zap className="h-6 w-6" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border border-blue-500/30 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            <Crown className="mr-2 h-5 w-5 text-yellow-400" />
            Choose Your Plan
          </DialogTitle>
        </DialogHeader>

        {!selectedPlan ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-blue-300">Unlock the full potential of AI-powered material discovery</p>
              <p className="text-sm text-blue-300/60">Affordable pricing designed for Ethiopian researchers and professionals</p>
            </div>

            {isLoading ? (
              <div className="text-center text-blue-300">Loading subscription plans...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plansData?.plans?.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`relative bg-black/20 border-2 transition-all hover:scale-105 ${
                      plan.name === "Professional"
                        ? "border-yellow-500/50 shadow-yellow-500/20"
                        : "border-blue-500/30 hover:border-blue-500/50"
                    }`}
                    data-testid={`plan-card-${plan.name.toLowerCase()}`}
                  >
                    {plan.name === "Professional" && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <div className="flex justify-center text-blue-400 mb-2">
                        {getPlanIcon(plan.name)}
                      </div>
                      <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                      <CardDescription className="text-blue-300/80">
                        {plan.description}
                      </CardDescription>
                      <div className="space-y-1">
                        <div className="text-3xl font-bold text-emerald-400">
                          {plan.priceInBirr} ETB
                        </div>
                        <div className="text-sm text-blue-300/60">per month</div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Separator className="bg-blue-500/20" />
                      <ul className="space-y-2">
                        {Array.isArray(plan.features) && plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span className="text-blue-100">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={() => handleSelectPlan(plan)}
                        className={`w-full ${
                          plan.name === "Professional"
                            ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black"
                            : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        }`}
                        data-testid={`button-select-${plan.name.toLowerCase()}`}
                      >
                        Choose {plan.name}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : paymentInstructions ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Complete Your Payment</h3>
              <p className="text-blue-300">Follow the instructions below to activate your {selectedPlan.name} subscription</p>
            </div>

            <Card className="bg-black/20 border border-blue-500/30">
              <CardHeader>
                <CardTitle className="flex items-center text-emerald-400">
                  {getPaymentMethodIcon(paymentMethod)} {paymentMethod.toUpperCase()} Payment Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentInstructions.shortCode && (
                  <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-sm text-blue-300 mb-2">Dial this number:</p>
                    <p className="text-2xl font-mono font-bold text-emerald-400">{paymentInstructions.shortCode}</p>
                  </div>
                )}
                {paymentInstructions.appName && (
                  <div className="text-center p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <Smartphone className="h-8 w-8 mx-auto mb-2 text-emerald-400" />
                    <p className="text-emerald-400 font-semibold">{paymentInstructions.appName}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-white mb-3">Step-by-step instructions:</h4>
                  <ol className="space-y-2">
                    {paymentInstructions.steps.map((step, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="text-blue-100">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-yellow-300">Estimated time:</span>
                  </div>
                  <span className="text-sm font-semibold text-yellow-400">{paymentInstructions.estimatedTime}</span>
                </div>
                <div className="text-center text-sm text-blue-300/60">
                  Need help? Call support: {paymentInstructions.supportPhone}
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-4">
              <Button
                onClick={() => {
                  setSelectedPlan(null);
                  setPaymentInstructions(null);
                }}
                variant="outline"
                className="flex-1 border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                data-testid="button-back-to-plans"
              >
                Back to Plans
              </Button>
              <Button
                onClick={handleVerifyPayment}
                disabled={verifyMutation.isPending}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                data-testid="button-verify-payment"
              >
                {verifyMutation.isPending ? "Verifying..." : "I've Made the Payment"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Choose Payment Method</h3>
              <p className="text-blue-300">Select your preferred Ethiopian payment method</p>
            </div>

            <Card className="bg-black/20 border border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white">Selected Plan: {selectedPlan.name}</CardTitle>
                <CardDescription className="text-emerald-400 text-xl font-bold">
                  {selectedPlan.priceInBirr} ETB / month
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              <label className="text-sm font-medium text-blue-300">Payment Method</label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="bg-black/20 border-blue-500/30 text-white" data-testid="select-payment-method">
                  <SelectValue placeholder="Choose a payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="telebirr">🇪🇹 Telebirr (Most Popular)</SelectItem>
                  <SelectItem value="mpesa">📱 M-PESA Ethiopia</SelectItem>
                  <SelectItem value="cbe">🏦 CBE Birr</SelectItem>
                  <SelectItem value="abyssinia">🏛️ Bank of Abyssinia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={() => setSelectedPlan(null)}
                variant="outline"
                className="flex-1 border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                data-testid="button-back-to-plans"
              >
                Back to Plans
              </Button>
              <Button
                onClick={handlePaymentSubmit}
                disabled={!paymentMethod || paymentMutation.isPending}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                data-testid="button-proceed-payment"
              >
                {paymentMutation.isPending ? "Processing..." : "Proceed to Payment"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}