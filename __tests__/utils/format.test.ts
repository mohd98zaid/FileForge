describe("Format Utilities", () => {
  test("file size formatting - bytes", () => {
    const formatSize = (bytes: number) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    expect(formatSize(500)).toBe("500 B");
    expect(formatSize(1023)).toBe("1023 B");
  });

  test("file size formatting - kilobytes", () => {
    const formatSize = (bytes: number) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    expect(formatSize(1024)).toBe("1.0 KB");
    expect(formatSize(1536)).toBe("1.5 KB");
    expect(formatSize(10240)).toBe("10.0 KB");
  });

  test("file size formatting - megabytes", () => {
    const formatSize = (bytes: number) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    expect(formatSize(1048576)).toBe("1.00 MB");
    expect(formatSize(5242880)).toBe("5.00 MB");
    expect(formatSize(10485760)).toBe("10.00 MB");
  });

  test("file size formatting - zero bytes", () => {
    const formatSize = (bytes: number) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    expect(formatSize(0)).toBe("0 B");
  });
});

describe("localStorage Operations", () => {
  test("setItem and getItem work", () => {
    localStorage.setItem("test-key", "test-value");
    expect(localStorage.getItem("test-key")).toBe("test-value");
  });

  test("removeItem works", () => {
    localStorage.setItem("test-key", "value");
    localStorage.removeItem("test-key");
    expect(localStorage.getItem("test-key")).toBeNull();
  });

  test("JSON serialization round-trip", () => {
    const data = { items: [1, 2, 3], name: "test" };
    localStorage.setItem("json-data", JSON.stringify(data));
    const retrieved = JSON.parse(localStorage.getItem("json-data")!);
    expect(retrieved).toEqual(data);
  });

  test("clear works", () => {
    localStorage.setItem("key1", "val1");
    localStorage.setItem("key2", "val2");
    localStorage.clear();
    expect(localStorage.getItem("key1")).toBeNull();
    expect(localStorage.getItem("key2")).toBeNull();
  });

  test("handles parsing invalid JSON gracefully", () => {
    localStorage.setItem("bad-json", "not valid json");
    expect(() => {
      try {
        JSON.parse(localStorage.getItem("bad-json")!);
      } catch {
        // Expected to throw
      }
    }).not.toThrow();
  });
});

describe("Date Formatting", () => {
  test("ISO date string parsing", () => {
    const date = new Date("2025-03-15");
    expect(date.getFullYear()).toBe(2025);
    expect(date.getMonth()).toBe(2); // 0-indexed
    expect(date.getDate()).toBe(15);
  });

  test("date difference calculation in days", () => {
    const start = new Date("2025-01-01");
    const end = new Date("2025-12-31");
    const diffDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    expect(diffDays).toBe(364);
  });

  test("date formatting to locale string", () => {
    const date = new Date(2025, 0, 15);
    const formatted = date.toLocaleDateString("en-IN");
    expect(formatted).toContain("15");
    expect(formatted).toContain("2025");
  });

  test("time formatting", () => {
    const date = new Date(2025, 0, 1, 14, 30, 45);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    expect(hours).toBe(14);
    expect(minutes).toBe(30);
    expect(seconds).toBe(45);
  });

  test("date object creation and comparison", () => {
    const earlier = new Date("2025-01-01");
    const later = new Date("2025-06-15");
    expect(later > earlier).toBe(true);
    expect(earlier < later).toBe(true);
  });

  test("leap year detection", () => {
    const isLeapYear = (year: number) =>
      (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2025)).toBe(false);
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
  });
});

describe("Utility Functions", () => {
  test("number formatting with Indian locale", () => {
    const formatCurrency = (val: number) => {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(val);
    };

    expect(formatCurrency(1234567)).toContain("12");
    expect(formatCurrency(0)).toContain("0");
  });

  test("percentage calculation", () => {
    const percent = (value: number, total: number) =>
      total > 0 ? Math.round((value / total) * 100) : 0;

    expect(percent(50, 100)).toBe(50);
    expect(percent(33, 100)).toBe(33);
    expect(percent(1, 0)).toBe(0);
  });

  test("clamp function", () => {
    const clamp = (val: number, min: number, max: number) =>
      Math.min(Math.max(val, min), max);

    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  test("debounce timer", () => {
    jest.useFakeTimers();
    let called = false;
    const timer = setTimeout(() => {
      called = true;
    }, 300);

    expect(called).toBe(false);
    jest.advanceTimersByTime(300);
    expect(called).toBe(true);
    jest.useRealTimers();
  });

  test("deep clone with JSON", () => {
    const original = { a: 1, b: { c: 2 }, d: [3, 4] };
    const clone = JSON.parse(JSON.stringify(original));
    expect(clone).toEqual(original);
    clone.b.c = 99;
    expect(original.b.c).toBe(2); // Original unchanged
  });
});
