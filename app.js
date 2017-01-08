//  LOOK AT THE APP STRUCTURE FILE TO SEE THE STRUCTURE OF THE JS FILE

//BUDGET CONTROLLER

var budgetController = (function() {
    
    //Objects in a function constructor
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    //Part 3
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current) {
            sum += current.value; //from this.value in the Expense and Income function constructors
        });
        data.totals[type] = sum;
    };
    
    /*
    //To store expenses and incomes
    var allExpenses = [];
    var allIncomes = [];
    var totalExpenses = 0;
    */
    
    var data = {
        allItems: { //object
            expense: [], //properties
            income: []
        },
        
        totals: {
            expense: 0,
            income: 0
        },
        
        budget: 0,
        percentage: -1 //not existant at this point
    };
    
    //return a public method to allow other modules to communicate with it
    return {
        addItem: function(type, desc, val) {
            var newItem;
            
            //Create a new ID by taking the last ID + 1
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            //Create a new item based on 'income' or 'expense' type
            if (type === 'expense') {
                newItem = new Expense(ID, desc, val);
            } else if (type === 'income') {
                newItem = new Income(ID, desc, val);
            }
            
            //Add the newItem to the data structure
            data.allItems[type].push(newItem);
            
            //return the new element
            return newItem;
        },
        
        //Part 2
        deleteItem: function(type, id) {
            var ids, index;
            
            //map returns a brand new array with the same length as the allItems[type] array
            //id = 6
            //ids = [1 2 4 6 8] map will return the same array
            //index = 3
            ids = data.allItems[type].map(function(current) { 
                return current.id;
            });
            
            //get the index
            index = ids.indexOf(id);
            
            if (index !== -1) {
                //delete element using splice
                data.allItems[type].splice(index, 1); //start deleting at index number, and how many elements
            }
        },
        
        calculateBudget: function() {
            // Calculate total income and expense
            calculateTotal('expense');
            calculateTotal('income');
            
            // Calculate the budget: income - expense
            data.budget = data.totals.income - data.totals.expense;
            
            // Calculate the percentage of income that we spent
            if (data.totals.income > 0) {
                data.percentage = Math.round(data.totals.expense / data.totals.income * 100);
            } else {
                data.percentage = -1;
            }
            
            // expense = 100 and income = 200, spent 50% = 100/200 - o.5 * 100
        },
        
        //Part 3
        calculatePercentages: function() {
            /*
            expenses
            a = 20
            b = 10
            c = 40
            income = 100
            percentages
            a = 20/100 = 20%
            b = 10/100 = 10%
            c = 40/100 = 40%
            */
            
            data.allItems.expense.forEach(function(current) {
                current.calcPercentage(data.totals.income);
            });
        },
        
        getPercentages: function() {
            var allPercentages = data.allItems.expense.map(function(current) { //map stores data in a variable
                return current.getPercentage(); //this will be called as many times as the number of current values there are
            });
            return allPercentages;
        },
        
        getBudget: function() {
            //Use an object to return many values at once
            return {
                budget: data.budget,
                totalIncome: data.totals.income,
                totalExpenses: data.totals.expense,
                percentage: data.percentage
            };
        },
        
        testing: function() {
            console.log(data);
        }
    };
   
})(); //The function is immediately declared and called because of the ()
//The variables x and a are in the closure and only the publicTest method can access them


// ----------------------


//MODULE OF THE UI, THE UI CONTROLLER

var UIController = (function() {
    
    //Variables not to repeat classes
    //It's going to be an object
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
        
    var formatNumber = function(num, type) {
        var numSplit, int, dec, type;

        /*
        + or - before the number
        exactly 2 decimal points
        comma separating the thousands

        2310.4567 -> + 2,310.46
        2000 -> + 2,000.00
        */

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //int.substr(0, 1) start at 0 and read 1 element
        }

        dec = numSplit[1];

        //type === 'expense' ? sign = '-' : sign = '+';
        //return type + ' ' + int + dec;

        return (type === 'expense' ? '-' : '+') + ' ' + int + '.' + dec; //the ( ) executes it first
    };
    
    var nodeListForEach = function(list, callback) {
        for (i=0; i<list.length; i++) {
            callback(list[i], i);
        };
    };
    
    //will return public methods by reading the data from the UI using the HTML
    return {
        //Get the values from the input on the UI
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value, //Will be either income or expense
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value) //parseFloat() converts to decimals
            };
        },
        
        //Add the input on the UI
        addListItem: function(obj, type) {
            var html, newHtml, element;
            
            //Create HTML string with a placeholder text % %, easier to find
            if (type === 'income') {
                element = DOMStrings.incomeContainer;
                
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            } else if (type === 'expense') {
                element = DOMStrings.expensesContainer;
                
                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            }

            //Replace the placeholder text with the data we receive from the object
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
                
            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); //beforeend adds it as the last element in the list before <p> for example, it is part of the list in the html
            
        },
        
        deleteListItem: function(selectorID) {
            //In javascript, we can't remove an element, we can only remove a child
            var el = document.getElementById(selectorID);
            
            el.parentNode.removeChild(el); //remove the child element of the parentNode of the element
        },
        
        //Clear the fields after adding income or expenses on the UI
        clearFields: function() {
            var fields, fieldsArr;
            
            //querySelectorAll returns a list, use instead of querySelector when we want more than one selector at once
            //slice returns a copy of the array that it's called on
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            
            //Use call method since slice is a function
            //slice is stored in the Array prototype
            //Tricks the slice method that we gave it an array, so it will return an array
            fieldsArr = Array.prototype.slice.call(fields);
            
            //Apply the call back function () to each element of the array
            //current value, index number, the entire array
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            //Focus on the first element of the array
            fieldsArr[0].focus();
        },
        
        displayBudget: function(obj) {
            obj.budget > 0 ? type = 'income' : type = 'expense';
            
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'income');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExpenses, 'expense');
            
            if (obj.percentage > 0) {
            document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
            document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },
        
        //Part 3
        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMStrings.expensesPercentageLabel); //returns a node list
            //it is called node because each of the DOM tree elements is called a node
            //loop over the nodes and changes the text property for all of them
                
            nodeListForEach(fields, function(current, index) {
                if (percentages[i] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
            
        },
        
        displayMonth: function() {
            var now, months, month, year;
            
            now = new Date();
            //var chrismas = new Date(2016, 11, 25);
            
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
        },
        
        changedType: function() {
            var fields = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue
            );
            
            nodeListForEach(fields, function(current) {
                current.classList.toggle('red-focus');
            });
            
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },
        
        getDOMStrings: function() {
            return DOMStrings; //Those become public so that we can use them on the other controllers
        }
    };
    
})();


// ----------------------


//THE MODULE THAT CONNECTS THE DATA AND THE UI

var controller = (function(budgetCtrl, UICtrl) {
    
    //Function to set up the event listeners
    var setUpEventListeners = function() {
        var DOM = UICtrl.getDOMStrings(); //Exposed to the public in the UIController
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem); //no () since it is a callback function, the addEventListener will call it when needed
    
        //Add the return press key event listener to the global document
        document.addEventListener('keypress', function(event) {
            //which is for older browsers
            if (event.keyCode === 13 || event.which === 13) {
                //Same code as the .add__btn button
                ctrlAddItem();
            }
        });
        
        //Part 2
        //Event delegation - income and expense have container in common on the html
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };
    
    //Function to update the budget
    var updateBudget = function() {
        //1. Calculate the budget
        budgetCtrl.calculateBudget();
        
        //2. return the budget
        var budget = budgetCtrl.getBudget();
        
        //3. Display the budget on the UI
        UICtrl.displayBudget(budget);
        
    };
    
    //Part 3
    var updatePercentages = function() {
        // 1.Calculate percentages
        budgetCtrl.calculatePercentages();
        
        // 2. Read them from the budgetController
        var percentages = budgetCtrl.getPercentages();
        
        // 3.Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    };
    
    //Function to add a new item
    var ctrlAddItem = function() {
        var input, newItem;
        
        //1. Get the field input data
        input = UICtrl.getInput(); //The public method that we can access from the UIController
        //console.log(input); //input the values on the console
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
            //3. Add the new item to the UI
            UICtrl.addListItem(newItem, input.type);

            //4. Clear the fields
            UICtrl.clearFields();

            //5. Calculate and update the budget
            updateBudget(); //from the updateBudget() function
            
            //6. Calculate and update the percentages
            updatePercentages();
        }
    };
    
    //Part 2
    var ctrlDeleteItem = function(event) { // pass in the event to know what the target element is
        var itemID, splitID, type, ID;
        
        /*
        console.log(event.target.parentNode.parentNode.parentNode.parentNode.id); //parentNode to move up 4 times in the DOM since we want to delete everything (click on the x button to check)
        */
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            splitID = itemID.split('-'); //split at -
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            
            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);
            
            // 3. Update and show the new budget
            updateBudget();
            
            // 4. Calculate and update the percentages
            updatePercentages();
        }
    };
    
    //return a public function init
    return {
        init: function() {
            console.log('Application has started.');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: -1
            });
            setUpEventListeners();
        }
    };
    
})(budgetController, UIController);

//This is how the whole application starts, all the code we want executed at the beginning of the application
controller.init();















