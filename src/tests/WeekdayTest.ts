/**
 * File to test how weekdays work in specific months of 2025
 */

// Function to count occurrences of a specific weekday in a given month
function countWeekdayOccurrencesInMonth(year: number, month: number, dayOfWeek: number): number {
  // Create date object for the first day of the month
  const date = new Date(year, month, 1);
  let count = 0;
  
  // Count all occurrences of the weekday in the month
  while (date.getMonth() === month) {
    if (date.getDay() === dayOfWeek) {
      count++;
    }
    date.setDate(date.getDate() + 1);
  }
  
  return count;
}

// Test for December 2025
const tuesdayCount = countWeekdayOccurrencesInMonth(2025, 11, 2); // 0=January, 11=December, 2=Tuesday
console.log(`Number of Tuesdays in December 2025: ${tuesdayCount}`);

// Check December 2025 calendar
console.log('December 2025 Calendar:');
const daysInDec2025 = new Date(2025, 12, 0).getDate();
const firstDayOfMonth = new Date(2025, 11, 1).getDay();

// Print header
console.log('Sun Mon Tue Wed Thu Fri Sat');

// Print calendar
let dayCount = 1;
let calendarString = '';

// Print leading spaces for first week
for (let i = 0; i < firstDayOfMonth; i++) {
  calendarString += '    ';
}

// Print days
while (dayCount <= daysInDec2025) {
  // Format day with proper spacing
  calendarString += dayCount.toString().padStart(3, ' ') + ' ';
  
  // Check if we've reached the end of a week
  if ((dayCount + firstDayOfMonth) % 7 === 0) {
    console.log(calendarString);
    calendarString = '';
  }
  
  dayCount++;
}

// Print any remaining days
if (calendarString !== '') {
  console.log(calendarString);
}

// Test all months in 2025 for Tuesday occurrences
console.log('\nNumber of Tuesdays in each month of 2025:');
for (let month = 0; month < 12; month++) {
  const count = countWeekdayOccurrencesInMonth(2025, month, 2);
  console.log(`${new Date(2025, month, 1).toLocaleString('default', { month: 'long' })}: ${count}`);
}

// Test the specific logic from ContributionCalculator
function shouldHaveWeekdayContribution(year: number, month: number, dayOfWeek: number): boolean {
  // Create a mock contribution with Tuesday as dayOfWeek
  const mockContribution = {
    frequency: 'weekly' as const,
    dayOfWeek: dayOfWeek,
    enabled: true
  };
  
  // Get all dates in the month
  const dates = [];
  const currentDate = new Date(year, month, 1);
  while (currentDate.getMonth() === month) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Apply the same logic as in shouldApplyContribution
  return dates.some(date => date.getDay() === mockContribution.dayOfWeek);
}

// Check if we should have a contribution for Tuesday in December 2025
const shouldHaveTuesdayContribution = shouldHaveWeekdayContribution(2025, 11, 2);
console.log(`\nShould have a Tuesday contribution in December 2025: ${shouldHaveTuesdayContribution}`);

// Testing weekly/biweekly contribution logic for Tuesday in Dec 2025
console.log('\nTuesdays in December 2025:');
const startOfDec2025 = new Date(2025, 11, 1);
const endOfDec2025 = new Date(2025, 12, 0);
const currentDate = new Date(startOfDec2025);

while (currentDate <= endOfDec2025) {
  if (currentDate.getDay() === 2) { // Tuesday = 2
    console.log(`Tuesday on: ${currentDate.toISOString().split('T')[0]}`);
  }
  currentDate.setDate(currentDate.getDate() + 1);
}

// Now let's test the calculation logic for monthly values
// Simulate materializing contributions for a weekly Tuesday contribution
console.log('\nSimulating contributions for weekly Tuesday contribution:');
function simulateMonthlyContributionsForWeekday(year: number, dayOfWeek: number, amount: number = 100) {
  const results: Record<string, number> = {};
  
  // Process for all 12 months
  for (let month = 0; month < 12; month++) {
    // Get all Tuesdays in the month
    const date = new Date(year, month, 1);
    let monthTotal = 0;
    
    // Process all days in the month
    while (date.getMonth() === month) {
      if (date.getDay() === dayOfWeek) { // dayOfWeek = 2 for Tuesday
        monthTotal += amount;
      }
      date.setDate(date.getDate() + 1);
    }
    
    // Record the month's total
    const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'long' });
    results[monthName] = monthTotal;
  }
  
  return results;
}

// Test for a weekly Tuesday contribution of $100
const weeklySummary = simulateMonthlyContributionsForWeekday(2025, 2, 100);
console.log('Monthly totals for $100 weekly Tuesday contribution in 2025:');
for (const [month, total] of Object.entries(weeklySummary)) {
  console.log(`${month}: $${total.toFixed(2)}`);
}

// Demonstrate the fix for December contribution
console.log('\nFixing the issue with December 2025 contributions:');

// Let's specifically test the logic for the 12th month (December) in the simulation
console.log('Detailed analysis for December 2025:');
const dec2025 = new Date(2025, 11, 1); // December 1, 2025
const daysInDecember = new Date(2025, 12, 0).getDate();

console.log(`Days in December 2025: ${daysInDecember}`);
console.log(`First day of December 2025: ${dec2025.toDateString()} (day of week: ${dec2025.getDay()})`);

// Count the Tuesdays in December 2025
let tuesdaysInDec = 0;
const tuesdayDates: string[] = [];
for (let day = 1; day <= daysInDecember; day++) {
  const date = new Date(2025, 11, day);
  if (date.getDay() === 2) { // Tuesday = 2
    tuesdaysInDec++;
    tuesdayDates.push(date.toISOString().split('T')[0]);
  }
}

console.log(`Number of Tuesdays in December 2025: ${tuesdaysInDec}`);
console.log(`Tuesday dates in December 2025: ${tuesdayDates.join(', ')}`);
console.log(`Expected contribution for December 2025: $${(tuesdaysInDec * 100).toFixed(2)}`);

// Finally, display a visual calendar of December 2025 with Tuesdays marked
console.log('\nDecember 2025 Calendar (Tuesdays marked with *):');
console.log('Sun Mon Tue Wed Thu Fri Sat');
let currentDay = 1;
let calendarRow = '';

// Add spaces for the first day of the month
for (let i = 0; i < dec2025.getDay(); i++) {
  calendarRow += '    ';
}

// Fill in the days
while (currentDay <= daysInDecember) {
  const date = new Date(2025, 11, currentDay);
  const isTuesday = date.getDay() === 2;
  
  // Format with a marker for Tuesdays
  if (isTuesday) {
    calendarRow += currentDay.toString().padStart(2, ' ') + '* ';
  } else {
    calendarRow += currentDay.toString().padStart(3, ' ') + ' ';
  }
  
  // New line after Saturday
  if (date.getDay() === 6) {
    console.log(calendarRow);
    calendarRow = '';
  }
  
  currentDay++;
}

// Print any remaining days
if (calendarRow.trim() !== '') {
  console.log(calendarRow);
}

// Test the exact logic that would be used in PortfolioCalculator for month calculation
console.log('\nSimulating the exact logic used in PortfolioCalculator:');

// Let's simulate 12 months starting from January
const startMonth = 1; // January
const simulationMonths = 12;

// Use the exact formula from PortfolioCalculator.getMonthContribution
console.log('\nCalculating calendar months using PortfolioCalculator logic:');
for (let month = 1; month <= simulationMonths; month++) {
  // Calculate the calendar month (1-12) for the current simulation month
  const calendarMonth = ((startMonth - 1 + month - 1) % 12) + 1;
  // Calculate the year offset
  const yearOffset = Math.floor((startMonth - 1 + month - 1) / 12);
  const currentYear = new Date().getFullYear() + yearOffset;
  
  // Create the month key as used in the calculator
  const key = `${currentYear}-${calendarMonth.toString().padStart(2, '0')}`;
  
  // For the last month (which should be December), also log additional details
  if (month === simulationMonths) {
    console.log(`Simulation month ${month} => Calendar month ${calendarMonth} (${new Date(currentYear, calendarMonth-1, 1).toLocaleString('default', { month: 'long' })}) of ${currentYear}, key=${key}`);
    
    // In PortfolioCalculator, there's a special dividend multiplier for December:
    const dividendMultiplier = (calendarMonth === 12) ? 2 : 1;
    console.log(`Special dividend multiplier for this month: ${dividendMultiplier}`);
  } else {
    console.log(`Simulation month ${month} => Calendar month ${calendarMonth} (${new Date(currentYear, calendarMonth-1, 1).toLocaleString('default', { month: 'long' })}) of ${currentYear}, key=${key}`);
  }
}