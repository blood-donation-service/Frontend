import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleCreateNeed } from "../../sharedcomponents/appSlice";
import { useDispatch } from "react-redux";

export default function NewRequest() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [newNeedForm, setNewNeedForm] = useState({
    title: "",
    needType: "خون کامل",
    bloodTypeRequired: "O+",
    quantityRequired: 2,
    region: "تهران - مرکز",
  });

  {
    /* ==========================================
            VIEW: CREATE NEW NEED REQUEST
            ========================================== */
  }
  return (
    <div className="animate-fade-in mx-auto max-w-2xl px-4 py-8">
      <div className="flex flex-col gap-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            ثبت نیاز فوری و اورژانسی جدید
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            با ثبت درخواست جدید، اعلان فوری در صفحه تمام اهداکنندگان نمایش داده
            خواهد شد.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(handleCreateNeed(newNeedForm, navigate));
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              عنوان درخواست (شرح کوتاه وضعیت بیمار)
            </label>
            <input
              type="text"
              placeholder="مثال: نیاز مبرم به خون O+ جهت جراحی تصادف"
              value={newNeedForm.title}
              onChange={(e) =>
                setNewNeedForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs focus:border-rose-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-600">
                گروه خونی مورد نیاز
              </label>
              <select
                value={newNeedForm.bloodTypeRequired}
                onChange={(e) =>
                  setNewNeedForm((prev) => ({
                    ...prev,
                    bloodTypeRequired: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs focus:border-rose-500 focus:outline-none"
                required
              >
                {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(
                  (type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-600">
                نوع نیاز
              </label>
              <select
                value={newNeedForm.needType}
                onChange={(e) =>
                  setNewNeedForm((prev) => ({
                    ...prev,
                    needType: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs focus:border-rose-500 focus:outline-none"
                required
              >
                <option value="خون کامل">خون کامل</option>
                <option value="پلاکت">پلاکت</option>
                <option value="پلاسما">پلاسما</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-600">
                تعداد ظرفیت مورد نیاز (واحد)
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={newNeedForm.quantityRequired}
                onChange={(e) =>
                  setNewNeedForm((prev) => ({
                    ...prev,
                    quantityRequired: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs focus:border-rose-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-600">
                منطقه اورژانس
              </label>
              <select
                value={newNeedForm.region}
                onChange={(e) =>
                  setNewNeedForm((prev) => ({
                    ...prev,
                    region: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs focus:border-rose-500 focus:outline-none"
                required
              >
                <option value="تهران - مرکز">تهران - مرکز</option>
                <option value="تهران - شمال">تهران - شمال</option>
                <option value="تهران - جنوب">تهران - جنوب</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Link
              type="button"
              to={"/staff-dashboard"}
              className="rounded-xl border border-slate-200 px-6 py-3 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"
            >
              انصراف
            </Link>
            <button
              type="submit"
              className="rounded-xl bg-rose-600 px-6 py-3 text-xs font-extrabold text-white shadow-md shadow-rose-600/15 transition-all hover:bg-rose-700 active:scale-95"
            >
              تایید و انتشار زنده
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
