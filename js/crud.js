function ViewModel() {
    var self = this;
    var apiUrl = "http://localhost:3000/data/";
    self.id = ko.observable();
    self.firstname = ko.observable();
    self.lastname = ko.observable();
    self.mobileno = ko.observable();
    self.customerList = ko.observableArray([]);
    self.sortOptions = ko.observableArray([
        'S.No ASC',
        'S.No DEC',
        'First Name ASC',
        'First Name DEC',
        'Last Name ASC',
        'Last Name DEC'
    ]);
    self.selectedSortOption = ko.observable('S.No ASC');

    function clearFields() {
        self.firstname('');
        self.lastname('');
    }

    // create customer
    self.createCustomer = function createCustomer() {
        var sortedCustomerList = self.customerList.sort();
        var newCustomerObj = {
            "id": sortedCustomerList[sortedCustomerList.length - 1].id + 1,
            "firstname": self.firstname(),
            "lastname": self.lastname(),
            "mobileno": self.mobileno()
        };
        fetch(apiUrl,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCustomerObj)
            })
            .then(resp => resp.json())
            .then(data => {
                clearFields();
                getCustomerListFromAPI();
            });
    }

    // read customer
    function getCustomerListFromAPI() {
        fetch(apiUrl)
            .then(resp => resp.json())
            .then(data => {
                if (data && data.length > 0) {
                    data.forEach((dataObj, dataIndex) => {
                        dataObj['index'] = dataIndex;
                        dataObj['isEditSelected'] = ko.observable(false);
                    });
                }
                self.customerList(data);
            });
    }

    self.editCustomer = function (selectedCustomer) {
        toggleActionButtons(true, selectedCustomer);

        self.id = ko.observable(selectedCustomer.id);
        self.firstname = ko.observable(selectedCustomer.firstname);
        self.lastname = ko.observable(selectedCustomer.lastname);
        self.mobileno = ko.observable(selectedCustomer.mobileno);
    }

    // update customer
    self.updateCustomer = function (selectedCustomer) {
        var updateCustomerObj = {
            "id": selectedCustomer.id,
            "firstname": selectedCustomer.firstname,
            "lastname": selectedCustomer.lastname,
            "mobileno": selectedCustomer.mobileno
        };
        fetch(apiUrl + selectedCustomer.id,
            {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateCustomerObj)
            })
            .then(resp => resp.json())
            .then(data => {
                getCustomerListFromAPI();
            });
    }

    // delete customer
    self.deleteCustomer = function (selectedCustomer) {
        fetch(apiUrl + selectedCustomer.id,
            {
                method: "DELETE"
            })
            .then(resp => resp.json())
            .then(data => {
                getCustomerListFromAPI();
            });
    }

    self.cancelEditCustomer = function (selectedCustomer) {
        toggleActionButtons(false, selectedCustomer);
    }

    function toggleActionButtons(status, selectedCustomer) {
        var customerList = self.customerList();
        customerList[selectedCustomer.index].isEditSelected(status);
    }

    self.onSort = function () {
        var sortOption = self.selectedSortOption();
        var customerList = self.customerList();
        var sortedList = [];
        switch (sortOption) {
            case 'S.No ASC':
                sortedList = sortListByKey(customerList, 'index', 'integer', 'ascending');
                self.customerList(sortedList);
                break;
            case 'S.No DEC':
                sortedList = sortListByKey(customerList, 'index', 'integer', 'descending');
                self.customerList(sortedList);
                break;
            case 'First Name ASC':
                sortedList = sortListByKey(customerList, 'firstname', 'string', 'ascending');
                self.customerList(sortedList);
                break;
            case 'First Name DEC':
                sortedList = sortListByKey(customerList, 'firstname', 'string', 'descending');
                self.customerList(sortedList);
                break;
            case 'Last Name ASC':
                sortedList = sortListByKey(customerList, 'lastname', 'string', 'ascending');
                self.customerList(sortedList);
                break;
            case 'Last Name DEC':
                sortedList = sortListByKey(customerList, 'lastname', 'string', 'descending');
                self.customerList(sortedList);
                break;
        }
    }

    function sortListByKey(list, fieldTobeSorted, fieldType, sortBy) {
        var field = fieldTobeSorted;
        fieldType = fieldType.toLowerCase();
        sortBy = sortBy.toLowerCase();
        if (list && list.length > 0) {
            if (fieldType === 'string') {
                if (sortBy === 'ascending') {
                    const sortedList = list.sort(function (a, b) {
                        const x = a[field].toLowerCase();
                        const y = b[field].toLowerCase();
                        return x < y ? -1 : x > y ? 1 : 0;
                    });
                    return sortedList;
                } else if (sortBy === 'descending') {
                    const sortedList = list.sort(function (a, b) {
                        const x = a[field].toLowerCase();
                        const y = b[field].toLowerCase();
                        return x > y ? -1 : x < y ? 1 : 0;
                    });
                    return sortedList;
                }
            } else if (fieldType === 'integer') {
                if (sortBy === 'ascending') {
                    const sortedList = list.sort(function (a, b) {
                        const x = a[field];
                        const y = b[field];
                        return x < y ? -1 : x > y ? 1 : 0;
                    });
                    return sortedList;
                } else if (sortBy === 'descending') {
                    const sortedList = list.sort(function (a, b) {
                        const x = a[field];
                        const y = b[field];
                        return x > y ? -1 : x < y ? 1 : 0;
                    });
                    return sortedList;
                }
            }
        }
    }

    getCustomerListFromAPI();
}

ko.applyBindings(new ViewModel());
