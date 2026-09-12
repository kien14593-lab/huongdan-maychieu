/* =====================================================================
   Hướng dẫn xử lý sự cố máy chiếu – JavaScript dùng chung
   Không phụ thuộc thư viện ngoài. Trang vẫn đọc được khi JS không chạy.
   ===================================================================== */
(function () {
  "use strict";

  var doc = document;

  function $all(selector, root) {
    return Array.prototype.slice.call((root || doc).querySelectorAll(selector));
  }

  /* Bỏ dấu tiếng Việt để tìm kiếm không phân biệt dấu: "khong tieng" ~ "không tiếng" */
  function boDau(str) {
    return String(str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/\s+/g, " ")
      .trim();
  }

  function laPlaceholder(v) {
    return !v || /^\s*\[.*\]\s*$/.test(String(v));
  }

  /* ---------------------------------------------------------------
     1. Chèn nội dung từ CONFIG (assets/js/config.js)
     --------------------------------------------------------------- */
  function apDungConfig() {
    var cfg = window.CONFIG || {};

    $all("[data-config]").forEach(function (el) {
      var key = el.getAttribute("data-config");
      var v = cfg[key];
      if (typeof v === "string" && v.trim() !== "") {
        el.textContent = v;
      }
      el.classList.toggle("is-placeholder", laPlaceholder(el.textContent));
    });

    /* Nút gọi: tạo liên kết tel: từ chữ số của số điện thoại.
       Nếu chưa cấu hình, giữ nguyên href dự phòng (thường là lien-he.html). */
    $all("[data-config-tel]").forEach(function (el) {
      var v = cfg[el.getAttribute("data-config-tel")];
      if (laPlaceholder(v)) {
        return;
      }
      var digits = String(v).replace(/[^\d+]/g, "");
      if (digits.replace(/\D/g, "").length >= 3) {
        el.setAttribute("href", "tel:" + digits);
      }
    });

    /* Liên kết tuỳ chọn (ví dụ Zalo): chỉ hiện khi đã có URL trong CONFIG. */
    $all("[data-config-href]").forEach(function (el) {
      var v = cfg[el.getAttribute("data-config-href")];
      if (laPlaceholder(v)) {
        el.hidden = true;
        return;
      }
      el.setAttribute("href", v);
      el.hidden = false;
    });

    /* Cho phép chèn giá trị vào thuộc tính value/placeholder của form. */
    $all("[data-config-value]").forEach(function (el) {
      var v = cfg[el.getAttribute("data-config-value")];
      if (typeof v === "string" && v.trim() !== "") {
        el.value = v;
      }
    });
  }

  /* ---------------------------------------------------------------
     2. Accordion (trang su-co.html và các trang có .acc)
     --------------------------------------------------------------- */
  function datTrangThai(btn, mo) {
    var panel = doc.getElementById(btn.getAttribute("aria-controls"));
    btn.setAttribute("aria-expanded", mo ? "true" : "false");
    if (panel) {
      panel.classList.toggle("is-open", mo);
    }
  }

  function moTheoHash() {
    var hash = decodeURIComponent(location.hash || "").replace(/^#/, "");
    if (!hash) {
      return;
    }
    var target = doc.getElementById(hash);
    if (!target) {
      return;
    }
    var acc = target.closest ? target.closest(".acc") : null;
    if (!acc) {
      return;
    }
    var btn = acc.querySelector(".acc__btn");
    if (btn) {
      datTrangThai(btn, true);
      $all(".acc.is-current").forEach(function (el) {
        el.classList.remove("is-current");
      });
      acc.classList.add("is-current");
      /* Cuộn lại sau khi mở, vì chiều cao trang vừa thay đổi */
      window.setTimeout(function () {
        acc.scrollIntoView({ block: "start" });
      }, 0);
    }
  }

  function khoiTaoAccordion() {
    var buttons = $all(".acc__btn");
    if (!buttons.length) {
      return;
    }

    buttons.forEach(function (btn) {
      datTrangThai(btn, false);
      btn.addEventListener("click", function () {
        var dangMo = btn.getAttribute("aria-expanded") === "true";
        datTrangThai(btn, !dangMo);
        var acc = btn.closest(".acc");
        if (acc && acc.id && !dangMo && window.history && history.replaceState) {
          history.replaceState(null, "", "#" + acc.id);
        }
      });
    });

    $all("[data-action='open-all']").forEach(function (el) {
      el.addEventListener("click", function () {
        buttons.forEach(function (btn) {
          datTrangThai(btn, true);
        });
      });
    });

    $all("[data-action='close-all']").forEach(function (el) {
      el.addEventListener("click", function () {
        buttons.forEach(function (btn) {
          datTrangThai(btn, false);
        });
      });
    });

    /* Khi in: mở toàn bộ để nội dung in đầy đủ (CSS in cũng đã ép hiện) */
    window.addEventListener("beforeprint", function () {
      buttons.forEach(function (btn) {
        datTrangThai(btn, true);
      });
    });

    moTheoHash();
    window.addEventListener("hashchange", moTheoHash);
  }

  /* ---------------------------------------------------------------
     3. Tìm nhanh triệu chứng (trang chủ)
     --------------------------------------------------------------- */
  function khoiTaoTimNhanh() {
    var input = doc.getElementById("tim");
    var list = doc.getElementById("ds-trieu-chung");
    if (!input || !list) {
      return;
    }
    var status = doc.getElementById("tim-status");
    var empty = doc.getElementById("tim-khong-thay");
    var items = $all("li", list).map(function (li) {
      return {
        el: li,
        text: boDau(li.textContent + " " + (li.getAttribute("data-keywords") || ""))
      };
    });
    var form = input.closest("form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
      });
    }

    function loc() {
      var q = boDau(input.value);
      var tu = q.split(" ").filter(Boolean);
      var dem = 0;
      items.forEach(function (it) {
        var khop = tu.every(function (t) {
          return it.text.indexOf(t) !== -1;
        });
        it.el.hidden = !khop;
        if (khop) {
          dem += 1;
        }
      });
      if (status) {
        status.textContent = q
          ? "Tìm thấy " + dem + " mục phù hợp."
          : "";
      }
      if (empty) {
        empty.hidden = !(q && dem === 0);
      }
    }

    input.addEventListener("input", loc);
    input.addEventListener("search", loc);
  }

  /* ---------------------------------------------------------------
     4. Mẫu báo sự cố: tự ghép nội dung + nút sao chép (trang liên hệ)
     --------------------------------------------------------------- */
  function khoiTaoMauBaoCao() {
    var textarea = doc.getElementById("mau-bao-cao");
    if (!textarea) {
      return;
    }
    var form = doc.getElementById("form-bao-cao");
    var status = doc.getElementById("copy-status");
    var mauGoc = textarea.value;

    function giaTri(id) {
      var el = doc.getElementById(id);
      return el ? String(el.value || "").trim() : "";
    }

    function ghepNoiDung() {
      if (!form) {
        return;
      }
      var daThu = $all("input[name='da-thu']:checked", form).map(function (c) {
        return c.value;
      });
      var ghiChu = giaTri("bc-ghi-chu");
      var dong = [
        "BÁO SỰ CỐ MÁY CHIẾU",
        "- Phòng: " + (giaTri("bc-phong") || "…"),
        "- Hãng máy chiếu: " + (giaTri("bc-hang") || "…"),
        "- Triệu chứng: " + (giaTri("bc-trieu-chung") || "…"),
        "- Đã thử: " + (daThu.length ? daThu.join("; ") : "…"),
        "- Mức độ: " + (giaTri("bc-muc-do") || "…"),
        "- Người báo / SĐT: " + (giaTri("bc-nguoi") || "…")
      ];
      if (ghiChu) {
        dong.push("- Ghi chú: " + ghiChu);
      }
      textarea.value = dong.join("\n");
    }

    function baoTrangThai(msg, loi) {
      if (!status) {
        return;
      }
      status.textContent = msg;
      status.style.color = loi ? "#9e0c24" : "";
      window.clearTimeout(baoTrangThai.t);
      baoTrangThai.t = window.setTimeout(function () {
        status.textContent = "";
      }, 4000);
    }

    function saoChep() {
      var text = textarea.value;
      function thanhCong() {
        baoTrangThai("✅ Đã sao chép. Dán vào Zalo/SMS/Email để gửi IT.");
      }
      function duPhong() {
        try {
          textarea.focus();
          textarea.select();
          textarea.setSelectionRange(0, text.length);
          var ok = doc.execCommand && doc.execCommand("copy");
          if (ok) {
            thanhCong();
          } else {
            baoTrangThai("Không sao chép tự động được. Hãy nhấn giữ vào ô và chọn Sao chép.", true);
          }
        } catch (e) {
          baoTrangThai("Không sao chép tự động được. Hãy nhấn giữ vào ô và chọn Sao chép.", true);
        }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(thanhCong, duPhong);
      } else {
        duPhong();
      }
    }

    if (form) {
      form.addEventListener("input", ghepNoiDung);
      form.addEventListener("change", ghepNoiDung);
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        ghepNoiDung();
        saoChep();
      });
      form.addEventListener("reset", function () {
        window.setTimeout(function () {
          textarea.value = mauGoc;
        }, 0);
      });
    }

    $all("[data-action='copy']").forEach(function (btn) {
      btn.addEventListener("click", saoChep);
    });
  }

  /* ---------------------------------------------------------------
     5. Nút in trang
     --------------------------------------------------------------- */
  function khoiTaoNutIn() {
    $all("[data-action='print']").forEach(function (btn) {
      btn.addEventListener("click", function () {
        window.print();
      });
    });
  }

  /* ---------------------------------------------------------------
     Khởi động
     --------------------------------------------------------------- */
  function khoiDong() {
    apDungConfig();
    khoiTaoAccordion();
    khoiTaoTimNhanh();
    khoiTaoMauBaoCao();
    khoiTaoNutIn();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", khoiDong);
  } else {
    khoiDong();
  }
})();
