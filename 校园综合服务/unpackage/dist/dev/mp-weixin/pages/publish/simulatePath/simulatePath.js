"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "simulatePath",
  setup(__props) {
    let mapCtx = null;
    const longitude = common_vendor.ref(113.457244);
    const latitude = common_vendor.ref(23.25904);
    const markers = common_vendor.ref([]);
    const polyline = common_vendor.ref([{
      points: [],
      color: "#204dad9a",
      width: 2
    }]);
    const isMoving = common_vendor.ref(false);
    const baseSpeed = common_vendor.ref(5);
    const minDuration = common_vendor.ref(2e3);
    const maxDuration = common_vendor.ref(4e3);
    const tempPoints = common_vendor.ref([]);
    common_vendor.onMounted(() => {
      mapCtx = common_vendor.index.createMapContext("myMap", this);
      mapCtx.setBoundary({
        southwest: {
          longitude: 113.453333,
          latitude: 23.255863
        },
        northeast: {
          longitude: 113.46152,
          latitude: 23.261935
        },
        complete(res) {
          common_vendor.index.__f__("log", "at pages/publish/simulatePath/simulatePath.vue:65", "setBoundary ", res);
        }
      });
      common_vendor.index.$on("sendData2", (res) => {
        common_vendor.index.__f__("log", "at pages/publish/simulatePath/simulatePath.vue:70", "接收到的数据222：", res.markers, res.polyline);
        if (res.markers == null && res.polyline == null) {
          common_vendor.index.__f__("log", "at pages/publish/simulatePath/simulatePath.vue:72", "kongkongkkkkk");
          return;
        }
        markers.value = res.markers;
        polyline.value = res.polyline;
      });
    });
    const setMoveAlong = () => {
      const points = polyline.value[0].points;
      if (points.length < 2) {
        common_vendor.index.showToast({
          title: "请添加至少两个路径点",
          icon: "none"
        });
        return;
      }
      const totalDistance = calculateTotalDistance(points);
      common_vendor.index.__f__("log", "at pages/publish/simulatePath/simulatePath.vue:93", "路径总长度 (米):", totalDistance);
      let duration = totalDistance * baseSpeed.value;
      duration = Math.max(
        minDuration.value,
        Math.min(duration, maxDuration.value)
      );
      common_vendor.index.__f__("log", "at pages/publish/simulatePath/simulatePath.vue:100", "最终动画时长 (毫秒):", duration);
      isMoving.value = true;
      mapCtx.moveAlong({
        markerId: 1,
        duration,
        autoRotate: true,
        path: points,
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/publish/simulatePath/simulatePath.vue:111", "移动成功：", res);
          common_vendor.index.showToast({
            title: "轨迹完成",
            icon: "none"
          });
        },
        fail: (res) => {
          common_vendor.index.__f__("log", "at pages/publish/simulatePath/simulatePath.vue:118", "移动失败: ", res.errMsg);
        },
        complete: (res) => {
          common_vendor.index.__f__("log", "at pages/publish/simulatePath/simulatePath.vue:121", "接口已调用（调用成功、失败都会执行）: ", res.errMsg);
          isMoving.value = false;
        }
      });
    };
    const onTapMap = (event) => {
      if (isMoving.value)
        return;
      const {
        latitude: latitude2,
        longitude: longitude2
      } = event.detail;
      const newPoint = {
        latitude: latitude2,
        longitude: longitude2
      };
      if (tempPoints.value.length === 0 && polyline.value[0].points.length === 0) {
        tempPoints.value = [newPoint];
      } else {
        const updatedPoints = tempPoints.value.length ? [...tempPoints.value, newPoint] : [...polyline.value[0].points, newPoint];
        polyline.value = [{
          points: updatedPoints,
          color: "#204dad9a",
          width: 2
        }];
        tempPoints.value = [];
      }
      markers.value = [{
        id: 1,
        iconPath: `/static/image/5.png`,
        latitude: newPoint.latitude,
        longitude: newPoint.longitude,
        width: 25,
        height: 25
      }];
    };
    const cancelPoints = () => {
      if (isMoving.value)
        return;
      const points = [...polyline.value[0].points];
      if (points.length === 0) {
        polyline.value = [{
          points: []
        }];
        markers.value = [];
        tempPoints.value = [];
        return;
      }
      points.pop();
      if (points.length < 2) {
        tempPoints.value = [...points];
        polyline.value = [{
          points: [],
          color: "#204dad9a",
          width: 2
        }];
        markers.value = points.length ? [{
          id: 1,
          iconPath: `/static/image/5.png`,
          latitude: points[0].latitude,
          longitude: points[0].longitude,
          width: 25,
          height: 25
        }] : [];
      } else {
        polyline.value = [{
          points,
          color: "#204dad9a",
          width: 2
        }];
        markers.value = [{
          id: 1,
          iconPath: `/static/image/5.png`,
          latitude: points[points.length - 1].latitude,
          longitude: points[points.length - 1].longitude,
          width: 25,
          height: 25
        }];
      }
    };
    const clearPoints = () => {
      if (isMoving.value)
        return;
      polyline.value = [{
        points: []
      }];
      markers.value = [];
      tempPoints.value = [];
    };
    const calculateTotalDistance = (points) => {
      let totalDistance = 0;
      for (let i = 0; i < points.length - 1; i++) {
        const start = points[i];
        const end = points[i + 1];
        totalDistance += calculateDistance(
          start.latitude,
          start.longitude,
          end.latitude,
          end.longitude
        );
      }
      return totalDistance;
    };
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371e3;
      const rad = Math.PI / 180;
      const deltaLat = (lat2 - lat1) * rad;
      const deltaLon = (lon2 - lon1) * rad;
      const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };
    const onComplete = () => {
      const {
        markers: currentMarkers,
        polyline: currentPolyline
      } = {
        markers: markers.value,
        polyline: polyline.value
      };
      if (currentMarkers.length === 0 || currentPolyline[0].points.length === 0) {
        common_vendor.index.showToast({
          title: "请先设置标记点和轨迹",
          icon: "none"
        });
        return;
      }
      common_vendor.index.__f__("log", "at pages/publish/simulatePath/simulatePath.vue:278", currentMarkers, currentPolyline);
      common_vendor.index.$emit("sendPick", {
        markers: currentMarkers,
        polyline: currentPolyline
      });
      common_vendor.index.navigateBack({
        delta: 1
      });
    };
    return (_ctx, _cache) => {
      return {
        a: latitude.value,
        b: longitude.value,
        c: markers.value,
        d: polyline.value,
        e: common_vendor.o(onTapMap),
        f: isMoving.value,
        g: common_vendor.o(setMoveAlong),
        h: common_vendor.o(cancelPoints),
        i: isMoving.value,
        j: common_vendor.o(clearPoints),
        k: isMoving.value,
        l: common_vendor.o(onComplete)
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/publish/simulatePath/simulatePath.js.map
