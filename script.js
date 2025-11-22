document.addEventListener('DOMContentLoaded', function() {
  const dayInput = document.getElementById('dayInput');
  const monthInput = document.getElementById('monthInput');
  const yearInput = document.getElementById('yearInput');
  const calculateBtn = document.getElementById('calculateBtn');
  const dayError = document.getElementById('dayError');
  const monthError = document.getElementById('monthError');
  const yearError = document.getElementById('yearError');
  const yearsResult = document.getElementById('yearsResult');
  const monthsResult = document.getElementById('monthsResult');
  const daysResult = document.getElementById('daysResult');

  // Set max year to current year
  const currentYear = new Date().getFullYear();
  yearInput.max = currentYear;

  // Function to validate day
  function validateDay(day, month, year) {
    if (!day || day === '') {
      return { isValid: false, message: 'This field is required' };
    }
    
    const dayNum = parseInt(day);
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
      return { isValid: false, message: 'Must be a valid day' };
    }
    
    // Check if day is valid for the given month and year
    if (month && year) {
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
      if (dayNum > daysInMonth) {
        return { isValid: false, message: 'Must be a valid date' };
      }
    }
    
    return { isValid: true };
  }

  // Function to validate month
  function validateMonth(month) {
    if (!month || month === '') {
      return { isValid: false, message: 'This field is required' };
    }
    
    const monthNum = parseInt(month);
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return { isValid: false, message: 'Must be a valid month' };
    }
    
    return { isValid: true };
  }

  // Function to validate year
  function validateYear(year) {
    if (!year || year === '') {
      return { isValid: false, message: 'This field is required' };
    }
    
    const yearNum = parseInt(year);
    const currentYear = new Date().getFullYear();
    
    if (isNaN(yearNum) || yearNum < 1800 || yearNum > currentYear) {
      return { isValid: false, message: 'Must be between 1800 and ' + currentYear };
    }
    
    return { isValid: true };
  }

  // Function to validate complete date
  function validateCompleteDate(day, month, year) {
    if (!day || !month || !year) {
      return { isValid: false, message: 'All fields are required' };
    }
    
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    // Check if the date is valid
    const date = new Date(yearNum, monthNum - 1, dayNum);
    if (date.getFullYear() !== yearNum || 
        date.getMonth() !== monthNum - 1 || 
        date.getDate() !== dayNum) {
      return { isValid: false, message: 'Must be a valid date' };
    }
    
    // Check if date is in the future
    const currentDate = new Date();
    if (date > currentDate) {
      return { isValid: false, message: 'Must be in the past' };
    }
    
    return { isValid: true };
  }

  // Function to calculate age
  function calculateAge(day, month, year) {
    const birthDate = new Date(year, month - 1, day);
    const currentDate = new Date();
    
    let years = currentDate.getFullYear() - birthDate.getFullYear();
    let months = currentDate.getMonth() - birthDate.getMonth();
    let days = currentDate.getDate() - birthDate.getDate();
    
    // Adjust for negative days
    if (days < 0) {
      months--;
      // Get the number of days in the previous month
      const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
      days += prevMonth.getDate();
    }
    
    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }
    
    return { years, months, days };
  }

  // Function to update UI based on validation
  function updateInputUI(input, errorElement, isValid, message = '') {
    if (isValid) {
      input.classList.remove('error');
      errorElement.classList.add('hidden');
    } else {
      input.classList.add('error');
      errorElement.textContent = message;
      errorElement.classList.remove('hidden');
    }
  }

  // Function to update result UI
  function updateResultUI(years, months, days) {
    yearsResult.textContent = years;
    monthsResult.textContent = months;
    daysResult.textContent = days;
  }

  // Event listener for calculate button
  calculateBtn.addEventListener('click', function() {
    const day = dayInput.value;
    const month = monthInput.value;
    const year = yearInput.value;
    
    // Reset all errors first
    updateInputUI(dayInput, dayError, true);
    updateInputUI(monthInput, monthError, true);
    updateInputUI(yearInput, yearError, true);
    
    // Validate individual fields first
    const dayValidation = validateDay(day, month, year);
    const monthValidation = validateMonth(month);
    const yearValidation = validateYear(year);
    
    let allValid = true;
    
    // Update UI based on individual validation
    if (!dayValidation.isValid) {
      updateInputUI(dayInput, dayError, false, dayValidation.message);
      allValid = false;
    }
    
    if (!monthValidation.isValid) {
      updateInputUI(monthInput, monthError, false, monthValidation.message);
      allValid = false;
    }
    
    if (!yearValidation.isValid) {
      updateInputUI(yearInput, yearError, false, yearValidation.message);
      allValid = false;
    }
    
    // If individual validations pass, validate the complete date
    if (allValid) {
      const dateValidation = validateCompleteDate(day, month, year);
      if (!dateValidation.isValid) {
        // Show the error on all fields for invalid date
        updateInputUI(dayInput, dayError, false, dateValidation.message);
        updateInputUI(monthInput, monthError, false, dateValidation.message);
        updateInputUI(yearInput, yearError, false, dateValidation.message);
        allValid = false;
      }
    }
    
    // If all validations pass, calculate and display age
    if (allValid) {
      const age = calculateAge(parseInt(day), parseInt(month), parseInt(year));
      updateResultUI(age.years, age.months, age.days);
    } else {
      updateResultUI('--', '--', '--');
    }
  });

  // Add event listeners for Enter key
  [dayInput, monthInput, yearInput].forEach(input => {
    input.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        calculateBtn.click();
      }
    });
  });
});