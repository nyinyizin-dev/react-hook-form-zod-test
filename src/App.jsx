import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Zod Validation Schema
const schema = z
  .object({
    name: z
      .string()
      .min(3, { message: "နာမည်က အနည်းဆုံး ၃ လုံးရှိရမယ်" })
      .max(50, { message: "နာမည်က အများဆုံး ၅၀ လုံးသာရှိရမယ်" }),

    email: z
      .string()
      .email({ message: "Email ပုံစံမှားနေပါတယ်" })
      .min(1, { message: "Email ထည့်ဖို့လိုပါတယ်" }),

    phone: z
      .string()
      .min(1, { message: "ဖုန်းနံပါတ်ထည့်ပါ" })
      .regex(/^09\d{7,9}$/, { message: "09 နဲ့စပြီး ၉-၁၁ လုံးရှိရမယ်" }),

    age: z
      .string()
      .min(1, { message: "အသက်ထည့်ပါ" })
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 18, {
        message: "အသက် ၁၈ နှစ်နဲ့အထက်ရှိရမယ်",
      }),

    gender: z.enum(["male", "female", "other"], {
      errorMap: () => ({ message: "ကျား/မ ရွေးချယ်ပါ" }),
    }),

    password: z
      .string()
      .min(6, { message: "Password က အနည်းဆုံး ၆ လုံးရှိရမယ်" })
      .regex(/[A-Z]/, { message: "စာကြီး ၁ လုံးပါရမယ်" })
      .regex(/[0-9]/, { message: "ဂဏန်း ၁ လုံးပါရမယ်" }),

    confirmPassword: z.string().min(1, { message: "Password အတည်ပြုပါ" }),

    terms: z.boolean().refine((val) => val === true, {
      message: "စည်းကမ်းချက်များကို သဘောတူရမည်",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password နှစ်ခုမတူညီပါ",
    path: ["confirmPassword"],
  });

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange", // Real-time validation
  });

  const onSubmit = async (data) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form Data:", data);
      alert("✅ အောင်မြင်စွာ မှတ်ပုံတင်ပြီးပါပြီ!");
      reset();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Watch password for strength indicator
  const password = watch("password", "");

  const getPasswordStrength = () => {
    if (password.length === 0) return { text: "", color: "" };
    if (password.length < 6)
      return { text: "အားနည်းသည်", color: "text-red-500" };
    if (password.length < 10)
      return { text: "အလယ်အလတ်", color: "text-yellow-500" };
    return { text: "ခိုင်မာသည်", color: "text-green-500" };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-t-2xl shadow-xl p-8 border-b-4 border-indigo-500">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              အကောင့်အသစ်ဖွင့်ရန်
            </h2>
            <p className="text-gray-600">သင့်အချက်အလက်များကို ဖြည့်သွင်းပါ</p>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-b-2xl shadow-xl p-8"
        >
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                နာမည် <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name")}
                type="text"
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.name
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                placeholder="သင့်နာမည်ကို ထည့်ပါ"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email and Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  အီးမေးလ် <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ဖုန်းနံပါတ် <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("phone")}
                  type="tel"
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.phone
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="09xxxxxxxxx"
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Age and Gender Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  အသက် <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("age")}
                  type="number"
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.age
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="သင့်အသက်"
                />
                {errors.age && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.age.message}
                  </p>
                )}
              </div>

              {/* Gender Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ကျား/မ <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("gender")}
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.gender
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <option value="">ရွေးချယ်ပါ</option>
                  <option value="male">ကျား</option>
                  <option value="female">မ</option>
                  <option value="other">အခြား</option>
                </select>
                {errors.gender && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                စကားဝှက် <span className="text-red-500">*</span>
              </label>
              <input
                {...register("password")}
                type="password"
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.password
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                placeholder="အနည်းဆုံး ၆ လုံး၊ စာကြီး၊ ဂဏန်းပါရမယ်"
              />
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">စကားဝှက်အားကောင်းမှု:</span>
                    <span className={`font-semibold ${strength.color}`}>
                      {strength.text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        password.length < 6
                          ? "bg-red-500 w-1/3"
                          : password.length < 10
                          ? "bg-yellow-500 w-2/3"
                          : "bg-green-500 w-full"
                      }`}
                    />
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                စကားဝှက်အတည်ပြုရန် <span className="text-red-500">*</span>
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.confirmPassword
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                placeholder="စကားဝှက်ကို ထပ်ရိုက်ပါ"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  {...register("terms")}
                  type="checkbox"
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3">
                <label className="text-sm text-gray-700">
                  <span className="font-medium">
                    စည်းကမ်းချက်များနှင့် ကိုယ်ရေးအချက်အလက်မူဝါဒ
                  </span>
                  ကို ဖတ်ပြီး သဘောတူပါသည်
                  <span className="text-red-500"> *</span>
                </label>
                {errors.terms && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.terms.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    တင်နေသည်...
                  </span>
                ) : (
                  "မှတ်ပုံတင်မယ်"
                )}
              </button>
            </div>

            {/* Footer Text */}
            <p className="text-center text-sm text-gray-600 pt-4">
              အကောင့်ရှိပြီးသားလား?
              <a
                href="#"
                className="ml-1 font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                လော့ဂ်အင်ဝင်ရန်
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
