import { useEffect, useRef, useState } from "react";
import { handleReserve, showToast } from "../../sharedcomponents/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { IRAN_PROVINCES } from "../../sharedcomponents/iranProvinces";
import { useUserInfo } from "../../sharedcomponents/useUserInfo";
import { useQueryClient } from "react-query";
import { IranMap } from "react-iran-map";
import { useFilteredRequests } from "../../sharedcomponents/useFilteredRequests";
import PageLoader from "../../sharedcomponents/PageLoader";
import FilteredNeedsLoader from "../../sharedcomponents/FilteredNeedsLoader";

const PROVINCE_DATA = {
  ardabil: 1,
  isfahan: 1,
  alborz: 1,
  ilam: 1,
  eastAzerbaijan: 1,
  westAzerbaijan: 1,
  bushehr: 1,
  tehran: 1,
  chaharmahalandBakhtiari: 1,
  southKhorasan: 1,
  razaviKhorasan: 1,
  northKhorasan: 1,
  khuzestan: 1,
  zanjan: 1,
  semnan: 1,
  sistanAndBaluchestan: 1,
  fars: 1,
  qazvin: 1,
  qom: 1,
  kurdistan: 1,
  kerman: 1,
  kohgiluyehAndBoyerAhmad: 1,
  kermanshah: 1,
  golestan: 1,
  gilan: 1,
  lorestan: 1,
  mazandaran: 1,
  markazi: 1,
  hormozgan: 1,
  hamadan: 1,
  yazd: 1,
};

const PROVINCE_NAME_MAP = {
  اردبیل: "ardabil",
  اصفهان: "isfahan",
  البرز: "alborz",
  ایلام: "ilam",
  "آذربایجان شرقی": "eastAzerbaijan",
  "آذربایجان غربی": "westAzerbaijan",
  بوشهر: "bushehr",
  تهران: "tehran",
  "چهارمحال و بختیاری": "chaharmahalandBakhtiari",
  "خراسان جنوبی": "southKhorasan",
  "خراسان رضوی": "razaviKhorasan",
  "خراسان شمالی": "northKhorasan",
  خوزستان: "khuzestan",
  زنجان: "zanjan",
  سمنان: "semnan",
  "سیستان و بلوچستان": "sistanAndBaluchestan",
  فارس: "fars",
  قزوین: "qazvin",
  قم: "qom",
  کردستان: "kurdistan",
  کرمان: "kerman",
  "کهگیلویه و بویراحمد": "kohgiluyehAndBoyerAhmad",
  کرمانشاه: "kermanshah",
  گلستان: "golestan",
  گیلان: "gilan",
  لرستان: "lorestan",
  مازندران: "mazandaran",
  مرکزی: "markazi",
  هرمزگان: "hormozgan",
  همدان: "hamadan",
  یزد: "yazd",
};

const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

const readUrlBloodType = () => {
  const raw = new URLSearchParams(window.location.search).get("blood_group");
  if (!raw) return "All";
  const restored = raw
    .replaceAll("_negative", "-")
    .replaceAll("_positive", "+")
    .toUpperCase();
  return BLOOD_TYPES.find((t) => t === restored) || "All";
};

const readUrlProvince = () => {
  const raw = new URLSearchParams(window.location.search).get("province");
  if (raw && IRAN_PROVINCES.includes(raw)) return raw;
  return "All";
};

export default function DonorDashboard() {
  const dispatch = useDispatch();
  const { isReserving } = useSelector((store) => store.app);
  const { data: userInfo } = useUserInfo();
  const queryClient = useQueryClient();
  const [, setSearchParams] = useSearchParams();

  const [filterBloodType, setFilterBloodType] = useState(readUrlBloodType);
  const [filterProvince, setFilterProvince] = useState(readUrlProvince);
  const [needId, setNeedId] = useState(null);

  const { data: filteredNeeds, isLoading } = useFilteredRequests(
    filterBloodType,
    filterProvince,
  );

  const mapContainerRef = useRef(null);
  const isBusy = isLoading || isReserving;

  const syncFiltersToUrl = (bloodType, province) => {
    const params = {};
    if (bloodType && bloodType !== "All") {
      params.blood_group = bloodType
        .replaceAll("-", "_negative")
        .replaceAll("+", "_positive")
        .toLowerCase();
    }
    if (province && province !== "All") {
      params.province = province;
    }
    setSearchParams(params, { replace: true });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const shapes = mapContainerRef.current.querySelectorAll(
      "svg path, svg polygon",
    );
    shapes.forEach((shape) => {
      if (shape.getAttribute("data-name") === filterProvince) {
        shape.classList.add("iran-map-selected");
      } else {
        shape.classList.remove("iran-map-selected");
      }
    });
  }, [filterProvince]);

  useEffect(() => {
    try {
      queryClient.invalidateQueries({
        queryKey: ["fetch_filtered_needs"],
      });
    } catch {
      return <PageLoader variant={"donor-dashboard"} />;
    }
  }, [queryClient]);

  const handleBloodTypeChange = (type) => {
    setFilterBloodType(type);
    syncFiltersToUrl(type, filterProvince);
  };

  const handleProvinceChange = (province) => {
    setFilterProvince(province);
    syncFiltersToUrl(filterBloodType, province);
  };

  if (userInfo?.user?.role === "medical_staff")
    return <Navigate to="/" replace />;
  return (
    <div className="animate-fade-in mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-lg font-black text-rose-600">
            {userInfo?.profile.blood_group || "مهمان"}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">
              جستجو در درخواست‌های اورژانسی
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              منطقه جغرافیایی و گروه خونی مطلوب را برای رزرو نوبت انتخاب
              فرمایید.
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="flex flex-col gap-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h4 className="border-b border-slate-50 pb-3 text-sm font-black text-slate-950">
              فیلترهای هوشمند جستجو
            </h4>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-500">
                گروه خونی مورد نیاز
              </label>
              <div className="flex flex-wrap gap-1.5">
                {["All", "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() => handleBloodTypeChange(type)}
                      disabled={isBusy}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${filterBloodType === type ? "bg-rose-600 text-white" : isBusy ? "cursor-wait bg-slate-50 text-slate-600" : "cursor-pointer bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
                    >
                      {type === "All" ? "همه گروه‌ها" : type}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-500">
                استان انتخابی
              </label>
              <select
                value={filterProvince}
                onChange={(e) => handleProvinceChange(e.target.value)}
                disabled={isBusy}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs focus:border-rose-500 focus:outline-none ${isBusy ? "cursor-wait" : "cursor-pointer"}`}
              >
                <option value="All">همه استان‌ها</option>
                {IRAN_PROVINCES.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h4 className="text-sm font-black text-slate-950">
              نقشه تعاملی استان‌های ایران
            </h4>
            <p className="text-[10px] leading-normal text-slate-400">
              برای فیلتر کردن هوشمند درخواست‌های هر استان، روی استان مورد نظر در
              نقشه کلیک کنید:
            </p>

            <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2">
              <div
                ref={mapContainerRef}
                className={`iran-map-container w-full ${isBusy ? "iran-map-busy" : ""}`}
              >
                <IranMap
                  key={filterProvince}
                  data={PROVINCE_DATA}
                  colorRange="254, 205, 211"
                  textColor="#475569"
                  width="100%"
                  defaultSelectedProvince={
                    filterProvince !== "All"
                      ? PROVINCE_NAME_MAP[filterProvince] || ""
                      : ""
                  }
                  deactiveProvinceColor="#e2e8f0"
                  selectedProvinceColor="#e11d48"
                  tooltipTitle=""
                  selectProvinceHandler={(province) => {
                    if (isBusy || !province?.faName) return;
                    const newProvince =
                      filterProvince === province.faName
                        ? "All"
                        : province.faName;
                    handleProvinceChange(newProvince);
                  }}
                />
              </div>

              <div className="mt-2 flex w-full items-center justify-between px-2">
                <span className="text-[10px] text-slate-400">
                  استان فعال:{" "}
                  <b>
                    {filterProvince === "All" ? "همه استان‌ها" : filterProvince}
                  </b>
                </span>
                {filterProvince !== "All" && (
                  <button
                    onClick={() => !isBusy && handleProvinceChange("All")}
                    disabled={isBusy}
                    className={`text-[10px] font-bold text-rose-600 ${isBusy ? "cursor-wait" : "cursor-pointer hover:underline"}`}
                  >
                    پاک کردن فیلتر
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs text-slate-500">
              یافت شده: <b>{filteredNeeds?.length} مورد فعال</b>
            </span>
            <span className="text-xs text-slate-400">
              آخرین بروزرسانی: هم‌اکنون
            </span>
          </div>

          {isLoading ? (
            <FilteredNeedsLoader />
          ) : filteredNeeds?.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
              <span className="text-4xl">🔍</span>
              <h4 className="text-sm font-bold text-slate-900">
                هیچ نیاز فعالی با فیلتر شما همخوانی ندارد.
              </h4>
              <p className="text-xs text-slate-400">
                گروه خونی دیگر یا مناطق اطراف را بررسی بفرمایید.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredNeeds?.map((need) => {
                const percentLeft =
                  (need.remaining_capacity / need.total_capacity) * 100;
                const isCritical = need.remaining_capacity === 1;

                return (
                  <div
                    key={need.id}
                    className={`relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition-all ${
                      isCritical
                        ? "border-rose-400 ring-2 ring-rose-50/50"
                        : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-xl font-black text-white shadow-inner shadow-rose-500/10">
                          {need.blood_group}
                        </span>
                        <div>
                          <h3 className="text-sm leading-snug font-extrabold text-slate-900 md:text-base">
                            {need.title}
                          </h3>
                          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                            <span>🏥 {need.medical_center}</span>
                            <span>•</span>
                            <span>📍 {need.province}</span>
                            <span>•</span>
                            <span>
                              ⏱️{" "}
                              {new Date(need.created_at).toLocaleTimeString(
                                "fa-IR",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isCritical && (
                          <span className="animate-pulse rounded-lg bg-rose-100 px-2 py-1 text-[10px] font-bold text-rose-700">
                            بسیار بحرانی (۱ واحد مانده)
                          </span>
                        )}
                        {!isCritical && (
                          <span className="rounded-lg border border-blue-100 bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">
                            فعال و معتبر
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-4 flex flex-col justify-between gap-4 rounded-2xl bg-slate-50 p-4 md:flex-row md:items-center">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="text-slate-400">
                          آدرس دقیق مراجعه:
                        </span>
                        <p className="leading-relaxed font-medium text-slate-600">
                          {need.address}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 text-xs whitespace-nowrap">
                        <span className="text-slate-400">تلفن هماهنگی:</span>
                        <span className="font-bold text-slate-600">
                          {need.phone_number}
                        </span>
                      </div>
                    </div>

                    <div className="mb-5 flex flex-col gap-1.5 border-b border-slate-50 pb-4">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-slate-400">
                          پیشرفت ظرفیت تأمین شده:
                        </span>
                        <span className="text-slate-700">
                          {need.total_capacity - need.remaining_capacity} از{" "}
                          {need.total_capacity} واحد (
                          {Math.round(100 - percentLeft)}%)
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCritical ? "bg-rose-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${100 - percentLeft}%` }}
                        ></div>
                      </div>
                    </div>

                    <Link
                      to={`${!userInfo?.user?.role ? "/login" : ""}`}
                      onClick={() => {
                        if (!userInfo?.user?.role) {
                          dispatch(
                            showToast(
                              "توجه",
                              "برای رزرو نوبت اهدای خون ابتدا وارد حساب کاربری خود شوید",
                              "info",
                            ),
                          );
                        } else if (!isBusy) {
                          dispatch(
                            handleReserve(
                              need.id,
                              need.blood_group,
                              need.remaining_capacity,
                              need.medical_center,
                              need.province,
                              userInfo,
                              queryClient,
                            ),
                          );
                          setNeedId(need.id);
                        }
                      }}
                      className={`mr-auto flex w-fit items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black transition-all ${
                        isBusy
                          ? need.id === needId
                            ? "cursor-wait bg-rose-100 text-rose-500 shadow-sm"
                            : "cursor-not-allowed bg-rose-600 text-white shadow-md shadow-rose-600/10"
                          : "bg-rose-600 text-white shadow-md shadow-rose-600/10 hover:bg-rose-700 active:scale-95"
                      }`}
                    >
                      {isBusy && need.id === needId ? (
                        <>
                          <span>در حال رزرو...</span>
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-rose-500 border-t-transparent"></span>
                        </>
                      ) : (
                        <>
                          <span>رزرو ظرفیت اهدای خون</span>
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
