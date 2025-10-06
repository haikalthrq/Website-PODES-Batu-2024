import { vizTheme, getFontSize } from "./vizTheme";

export const apexBaseOptions = {
  chart: {
    background: vizTheme.bg,
    foreColor: vizTheme.text,
    fontFamily: "inherit",
    toolbar: { 
      show: false 
    },
    animations: { 
      enabled: true,
      easing: 'easeinout',
      speed: 800
    },
    dropShadow: {
      enabled: false
    }
  },
  colors: vizTheme.series,
  grid: {
    borderColor: vizTheme.grid,
    strokeDashArray: 0,
    xaxis: {
      lines: {
        show: false
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  },
  dataLabels: {
    enabled: true,
    style: {
      colors: [vizTheme.text],
      fontSize: `${getFontSize('sm')}px`,
      fontWeight: 600
    },
    background: {
      enabled: false
    }
  },
  legend: {
    position: "top" as const,
    horizontalAlign: "center" as const,
    labels: {
      colors: vizTheme.text,
      useSeriesColors: false
    },
    markers: {
      width: 12,
      height: 12,
      strokeWidth: 0,
      fillColors: vizTheme.series,
      radius: 6
    },
    fontSize: `${getFontSize('sm')}px`,
    fontWeight: 400
  },
  stroke: {
    width: 2,
    colors: [vizTheme.cardBg],
    lineCap: "round" as const
  },
  fill: {
    opacity: 0.95,
    type: "solid" as const
  },
  tooltip: {
    theme: "light" as const,
    style: {
      fontSize: `${getFontSize('sm')}px`
    },
    marker: {
      show: true
    }
  },
  noData: {
    text: "Tidak ada data tersedia",
    align: "center" as const,
    verticalAlign: "middle" as const,
    offsetX: 0,
    offsetY: 0,
    style: {
      color: vizTheme.textMuted,
      fontSize: `${getFontSize('md')}px`
    }
  },
  responsive: [{
    breakpoint: 480,
    options: {
      legend: {
        position: "bottom" as const
      }
    }
  }]
};

// Specific overrides for donut charts
export const donutOptions = {
  ...apexBaseOptions,
  plotOptions: {
    pie: {
      donut: {
        size: "68%",
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: `${getFontSize('md')}px`,
            fontWeight: 600,
            color: vizTheme.text
          },
          value: {
            show: true,
            fontSize: `${getFontSize('lg')}px`,
            fontWeight: 700,
            color: vizTheme.text,
            formatter: (val: string) => val
          },
          total: {
            show: true,
            showAlways: false,
            label: "Total",
            fontSize: `${getFontSize('md')}px`,
            fontWeight: 600,
            color: vizTheme.text
          }
        }
      },
      expandOnClick: true
    }
  }
};

// Specific overrides for bar charts
export const barOptions = {
  ...apexBaseOptions,
  plotOptions: {
    bar: {
      borderRadius: 6,
      dataLabels: {
        position: "top" as const
      },
      distributed: false
    }
  },
  xaxis: {
    labels: {
      style: {
        colors: vizTheme.text,
        fontSize: `${getFontSize('sm')}px`
      }
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: vizTheme.text,
        fontSize: `${getFontSize('sm')}px`
      }
    }
  }
};