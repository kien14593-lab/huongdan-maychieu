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
     3. Danh sách phòng → hãng máy chiếu (CONFIG.phong)
     Nhóm hiển thị trên web: hitachi | sony | infoto | khac (các hãng còn lại).
     --------------------------------------------------------------- */
  var CAC_HANG = ["hitachi", "sony", "infoto", "khac"];
  var TEN_HANG = {
    hitachi: "Hitachi",
    sony: "Sony",
    infoto: "Infoto",
    nec: "NEC",
    epson: "Epson",
    viewsonic: "ViewSonic",
    eiki: "Eiki",
    khac: "hãng khác"
  };

  function nhomCua(hang) {
    return CAC_HANG.indexOf(hang) !== -1 && hang !== "khac" ? hang : "khac";
  }

  function tenHang(hang) {
    return TEN_HANG[hang] || hang;
  }

  function danhSachPhong() {
    var p = (window.CONFIG || {}).phong;
    return p && typeof p === "object" ? p : {};
  }

  /* "phòng 203 e7" → "203E7"; "301dn" → "301ĐN" */
  function chuanHoaPhong(s) {
    var ma = String(s || "").toUpperCase().replace(/[\s.\-_/]/g, "").replace(/^PH[OÒ]NG/, "");
    var ds = danhSachPhong();
    if (ma && !ds[ma] && /DN$/.test(ma)) {
      ma = ma.replace(/DN$/, "ĐN");
    }
    return ma;
  }

  function timPhong(s) {
    var ma = chuanHoaPhong(s);
    var hang = danhSachPhong()[ma];
    return hang ? { ma: ma, hang: hang, nhom: nhomCua(hang) } : null;
  }

  function phongTheoNhom() {
    var ds = danhSachPhong();
    var kq = { hitachi: [], sony: [], infoto: [], khac: [] };
    Object.keys(ds).forEach(function (ma) {
      kq[nhomCua(ds[ma])].push(ma);
    });
    return kq;
  }

  /* Điền danh sách / số phòng vào các vị trí data-phong-list / data-phong-count="nhóm" */
  function dienDanhSachPhong() {
    var nhom = phongTheoNhom();
    $all("[data-phong-list]").forEach(function (el) {
      var ds = nhom[el.getAttribute("data-phong-list")] || [];
      if (ds.length) {
        el.textContent = ds.join(", ");
      }
    });
    $all("[data-phong-count]").forEach(function (el) {
      var ds = nhom[el.getAttribute("data-phong-count")] || [];
      if (ds.length) {
        el.textContent = String(ds.length);
      }
    });
  }

  /* Ô "gõ số phòng" ở trang chủ */
  function khoiTaoTraPhong() {
    var form = doc.getElementById("form-phong");
    var input = doc.getElementById("phong-input");
    var kq = doc.getElementById("phong-kq");
    if (!form || !input || !kq) {
      return;
    }
    var datalist = doc.getElementById("ds-phong");
    if (datalist) {
      var ds = danhSachPhong();
      datalist.innerHTML = "";
      Object.keys(ds).forEach(function (ma) {
        var opt = doc.createElement("option");
        opt.value = ma;
        opt.label = ma + " – " + tenHang(ds[ma]);
        datalist.appendChild(opt);
      });
    }

    function lienKet(p) {
      return "su-co.html?may=" + p.nhom + "&phong=" + encodeURIComponent(p.ma);
    }

    function hienKetQua() {
      var goc = input.value.trim();
      var p = timPhong(goc);
      kq.innerHTML = "";
      kq.classList.remove("phong__kq--loi");
      if (!goc) {
        kq.hidden = true;
        return null;
      }
      if (p) {
        var a = doc.createElement("a");
        a.className = "btn btn--primary";
        a.href = lienKet(p);
        a.textContent = "Xem sự cố máy " + tenHang(p.nhom === "khac" ? p.hang : p.nhom) + " →";
        var s = doc.createElement("span");
        s.innerHTML = "Phòng <strong>" + p.ma + "</strong>: máy chiếu <strong>" + tenHang(p.hang) + "</strong>" +
          (p.nhom === "khac" ? " (nhóm hãng khác)" : "") + ". ";
        kq.appendChild(s);
        kq.appendChild(a);
      } else if (chuanHoaPhong(goc).length >= 3) {
        kq.textContent = "Không có phòng “" + goc + "” trong danh sách. Kiểm tra lại số phòng hoặc chọn theo loại máy chiếu bên dưới.";
        kq.classList.add("phong__kq--loi");
      } else {
        kq.hidden = true;
        return null;
      }
      kq.hidden = false;
      return p;
    }

    input.addEventListener("input", hienKetQua);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var p = hienKetQua();
      if (p) {
        location.href = lienKet(p);
      } else {
        input.focus();
      }
    });
  }

  /* ---------------------------------------------------------------
     4. Chọn hãng máy chiếu (trang su-co.html, tham số ?may=… hoặc ?phong=…)
     Hiện banner hãng tương ứng; không chọn vẫn xem được toàn bộ nội dung.
     --------------------------------------------------------------- */
  function khoiTaoChonHang() {
    var banners = $all(".hang-banner[data-may]");
    var chips = $all(".chip[data-may]");
    if (!banners.length && !chips.length) {
      return;
    }
    var trong = doc.querySelector(".hang-banner--trong");

    function hien(may, phong) {
      banners.forEach(function (b) {
        b.hidden = b.getAttribute("data-may") !== may;
        $all("[data-phong-info]", b).forEach(function (el) {
          if (phong && !b.hidden) {
            el.textContent = "Phòng " + phong.ma + ": máy chiếu " + tenHang(phong.hang) + ".";
            el.hidden = false;
          } else {
            el.hidden = true;
          }
        });
      });
      chips.forEach(function (c) {
        var active = c.getAttribute("data-may") === may;
        c.classList.toggle("is-active", active);
        if (active) {
          c.setAttribute("aria-current", "true");
        } else {
          c.removeAttribute("aria-current");
        }
      });
      if (trong) {
        trong.hidden = !!may;
      }
    }

    function docThamSo() {
      var mp = /[?&]phong=([^&#]+)/.exec(location.search);
      var phong = null;
      if (mp) {
        try {
          phong = timPhong(decodeURIComponent(mp[1].replace(/\+/g, " ")));
        } catch (err) {
          phong = null; /* tham số mã hoá sai → bỏ qua */
        }
      }
      var mm = /[?&]may=([a-z]+)/.exec(location.search);
      var may = mm && CAC_HANG.indexOf(mm[1]) !== -1 ? mm[1] : "";
      if (phong) {
        may = phong.nhom;
      }
      return { may: may, phong: phong };
    }

    chips.forEach(function (c) {
      c.addEventListener("click", function (e) {
        if (!(window.history && history.replaceState)) {
          return; /* trình duyệt cũ: đi theo liên kết bình thường */
        }
        e.preventDefault();
        var may = c.getAttribute("data-may");
        history.replaceState(null, "", location.pathname + "?may=" + may + location.hash);
        hien(may, null);
      });
    });

    var ts = docThamSo();
    hien(ts.may, ts.phong);
  }

  /* ---------------------------------------------------------------
     5. Mẫu báo sự cố: tự ghép nội dung + nút sao chép (trang liên hệ)
     --------------------------------------------------------------- */
  function khoiTaoMauBaoCao() {
    var textarea = doc.getElementById("mau-bao-cao");
    if (!textarea) {
      return;
    }
    var form = doc.getElementById("form-bao-cao");
    var status = doc.getElementById("copy-status");
    var mauGoc = textarea.value;
    var oPhong = doc.getElementById("bc-phong");
    var oHang = doc.getElementById("bc-hang");
    var goiYPhong = doc.getElementById("bc-phong-hint");

    function giaTri(id) {
      var el = doc.getElementById(id);
      return el ? String(el.value || "").trim() : "";
    }

    /* Gõ số phòng → tự chọn hãng máy theo danh sách phòng */
    function nhanHangTheoPhong() {
      if (!oPhong || !oHang) {
        return;
      }
      var p = timPhong(oPhong.value);
      if (goiYPhong) {
        goiYPhong.hidden = !p;
        goiYPhong.textContent = p ? "Phòng " + p.ma + ": máy chiếu " + tenHang(p.hang) + " (theo danh sách phòng)." : "";
      }
      if (!p) {
        return;
      }
      $all("option", oHang).some(function (opt) {
        if (opt.getAttribute("data-hang") === p.nhom) {
          oHang.value = opt.value;
          return true;
        }
        return false;
      });
    }

    function ghepNoiDung() {
      if (!form) {
        return;
      }
      var daThu = $all("input[name='da-thu']:checked", form).map(function (c) {
        return c.value;
      });
      var ghiChu = giaTri("bc-ghi-chu");
      var p = timPhong(giaTri("bc-phong"));
      var hang = giaTri("bc-hang") || "…";
      if (p && p.nhom === "khac") {
        hang = tenHang(p.hang) + " (theo danh sách phòng)";
      }
      var dong = [
        "BÁO SỰ CỐ MÁY CHIẾU",
        "- Phòng: " + (giaTri("bc-phong") || "…"),
        "- Hãng máy chiếu: " + hang,
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
      if (oPhong) {
        oPhong.addEventListener("input", nhanHangTheoPhong);
      }
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
          if (goiYPhong) {
            goiYPhong.hidden = true;
          }
        }, 0);
      });
    }

    $all("[data-action='copy']").forEach(function (btn) {
      btn.addEventListener("click", saoChep);
    });
  }

  /* ---------------------------------------------------------------
     6. Nút in trang
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
    dienDanhSachPhong();
    khoiTaoAccordion();
    khoiTaoTraPhong();
    khoiTaoChonHang();
    khoiTaoMauBaoCao();
    khoiTaoNutIn();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", khoiDong);
  } else {
    khoiDong();
  }
})();
