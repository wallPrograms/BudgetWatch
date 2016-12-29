//  LOOK AT THE APP STRUCTURE FILE TO SEE THE STRUCTURE OF THE JS FILE

//BUDGET CONTROLLER

var budgetController = (function() {
    
    //Objects in a function constructor
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
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
        percentageLabel:'.budget__expenses--percentage' 
    };
        
    //will return public methods by reading the data from the UI using the HTML
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value, //Will be either income or expense
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value) //parseFloat() converts to decimals
            };
        },
        
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
            newHtml = newHtml.replace('%value%', obj.value);
                
            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); //beforeend adds it as the last element in the list before <p> for example, it is part of the list in the html
            
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
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalIncome;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExpenses;
            
            if (obj.percentage > 0) {
            document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
            document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
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
        }
    };
    
    //return a public function init
    return {
        init: function() {
            console.log('Application has started.');
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














