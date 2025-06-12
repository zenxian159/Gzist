"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "selectPoint",
  setup(__props) {
    let mapCtx = null;
    const centerLat = common_vendor.ref(23.25904);
    const centerLng = common_vendor.ref(113.457244);
    const markers = common_vendor.ref([]);
    const locationName = common_vendor.ref("");
    common_vendor.onMounted(() => {
      mapCtx = common_vendor.index.createMapContext("myMap");
      mapCtx.setBoundary({
        southwest: {
          latitude: 23.255863,
          longitude: 113.453333
        },
        northeast: {
          latitude: 23.261935,
          longitude: 113.46152
        }
      });
      common_vendor.index.$on("sendData", (payload) => {
        const m = payload.marker;
        if (m && typeof m.latitude === "number" && typeof m.longitude === "number") {
          markers.value = [
            {
              id: 0,
              latitude: m.latitude,
              longitude: m.longitude,
              iconPath: "/static/image/7.png",
              width: 32,
              height: 32
            }
          ];
          if (payload.location) {
            locationName.value = payload.location;
          } else {
            getClosestLocationName(m.latitude, m.longitude);
          }
        }
      });
    });
    const onMapTap = (e) => {
      const {
        latitude,
        longitude
      } = e.detail;
      const marker = {
        id: 0,
        latitude,
        longitude,
        iconPath: "/static/image/7.png",
        width: 32,
        height: 32
      };
      markers.value = [marker];
      getClosestLocationName(latitude, longitude);
    };
    function getClosestLocationName(lat, lng) {
      common_vendor.index.request({
        url: "https://apis.map.qq.com/ws/geocoder/v1/",
        data: {
          location: `${lat},${lng}`,
          key: "YA2BZ-GNVWB-F4FUO-JGREH-NY5Q3-XLBG2",
          get_poi: 1,
          poi_options: "radius=500;page_size=10"
        },
        success(res) {
          if (res.data.status === 0) {
            const pois = res.data.result.pois || [];
            let best = res.data.result.address;
            if (pois.length) {
              let minD = Infinity;
              pois.forEach((poi) => {
                const d = haversine(lat, lng, poi.location.lat, poi.location.lng);
                if (d < minD) {
                  minD = d;
                  best = poi.title;
                }
              });
            }
            locationName.value = best;
          } else {
            common_vendor.index.__f__("error", "at pages/publish/selectPoint/selectPoint.vue:129", "逆地址解析失败", res.data);
            common_vendor.index.showToast({
              title: "地址获取失败",
              icon: "none"
            });
          }
        },
        fail(err) {
          common_vendor.index.__f__("error", "at pages/publish/selectPoint/selectPoint.vue:137", "请求逆地址解析出错", err);
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      });
    }
    function haversine(lat1, lng1, lat2, lng2) {
      const toRad = (v) => v * Math.PI / 180;
      const R = 6371e3;
      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
    const onComplete = () => {
      if (!locationName.value) {
        common_vendor.index.showToast({
          title: "请先设置标记点",
          icon: "none"
        });
        return;
      }
      const marker = markers.value[0];
      common_vendor.index.$emit("sendLost", {
        currentMarker: marker,
        locationName: locationName.value
      });
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return {
        a: centerLat.value,
        b: centerLng.value,
        c: markers.value,
        d: common_vendor.o(onMapTap),
        e: common_vendor.t(locationName.value || "未设置标记点"),
        f: common_vendor.o(onComplete)
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/publish/selectPoint/selectPoint.js.map
