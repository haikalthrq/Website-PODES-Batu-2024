/**
 * Common ECharts option factories for donut, bar, and stacked bar charts
 * Used by both infrastructure and environment categories
 */

export function donutOptions({ title, seriesData, centerText, colors = [] }) {
  return {
    title: {
      text: title,
      left: 'center',
      top: 20,
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#374151'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151'
      }
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      left: 'center',
      textStyle: {
        fontSize: 12,
        color: '#6b7280'
      },
      itemWidth: 14,
      itemHeight: 14
    },
    series: [
      {
        name: title,
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: seriesData.map((item, index) => ({
          ...item,
          itemStyle: {
            color: colors[index] || item.color || `hsl(${index * 60}, 70%, 50%)`
          }
        }))
      }
    ],
    graphic: centerText ? {
      type: 'text',
      left: 'center',
      top: 'middle',
      style: {
        text: centerText,
        textAlign: 'center',
        fill: '#374151',
        fontSize: 14,
        fontWeight: 600
      }
    } : null
  };
}

export function barOptions({ title, xData, yData, colors = [], horizontal = false }) {
  const isHorizontal = horizontal;
  
  return {
    title: {
      text: title,
      left: 'center',
      top: 20,
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#374151'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151'
      }
    },
    grid: {
      left: isHorizontal ? '15%' : '10%',
      right: '10%',
      top: '20%',
      bottom: '15%',
      containLabel: true
    },
    [isHorizontal ? 'yAxis' : 'xAxis']: {
      type: 'category',
      data: xData,
      axisLabel: {
        color: '#6b7280',
        fontSize: 12,
        formatter: function(value) {
          return value.length > 10 ? value.substring(0, 10) + '...' : value;
        }
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      }
    },
    [isHorizontal ? 'xAxis' : 'yAxis']: {
      type: 'value',
      axisLabel: {
        color: '#6b7280',
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6'
        }
      }
    },
    series: [
      {
        name: title,
        type: 'bar',
        data: yData.map((value, index) => ({
          value,
          itemStyle: {
            color: colors[index] || `hsl(${index * 60}, 70%, 50%)`
          }
        })),
        itemStyle: {
          borderRadius: isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]
        }
      }
    ]
  };
}

export function stackedBarOptions({ title, categories, series, groupKey = 'kecamatan', colors = [] }) {
  return {
    title: {
      text: title,
      left: 'center',
      top: 20,
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#374151'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151'
      }
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      left: 'center',
      textStyle: {
        fontSize: 12,
        color: '#6b7280'
      },
      itemWidth: 14,
      itemHeight: 14
    },
    grid: {
      left: '10%',
      right: '10%',
      top: '20%',
      bottom: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        color: '#6b7280',
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#6b7280',
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6'
        }
      }
    },
    series: series.map((s, index) => ({
      ...s,
      type: 'bar',
      stack: 'total',
      itemStyle: {
        color: colors[index] || s.color || `hsl(${index * 60}, 70%, 50%)`,
        borderRadius: index === series.length - 1 ? [4, 4, 0, 0] : 0
      }
    }))
  };
}