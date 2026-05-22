# 4.	Напишіть функцію, яка приймає три параметри (a, b, c) 
# і виводить на екран найменше з них.

def get_min(arr):
    min_val = arr[0]

    for x in arr:
        if x < min_val:
            min_val = x

    return min_val

print(get_min([3, 1, 2]))

# 4.	Напишіть функцію, яка приймає рядок та повертає його 
# обернений варіант. Наприклад, "hello" повинно повернути "olleh".

def reverse_string(str):
    return "".join(reversed(str))

    # return str[::-1]

print(reverse_string("hello"))

# 4.	Реалізуйте програму, яка визначає, 
# чи є слово паліндромом (читається однаково з обох боків).


def is_palindrome(str):
    return str == reverse_string(str)

print(is_palindrome("hello"))

# 4.	Розробіть алгоритм сортування масиву чисел методом швидкого
#  сортування (QuickSort) та виведіть відсортований масив.

array_to_sort = [7, 4, 2, 9, 1, 5]

def quick_sort(array):
    if (len(array) <= 1):
        return array
    
    pivot = array[0]

    less = [x for x in array if x < pivot]
    equal = [x for x in array if x == pivot]
    more = [x for x in array if x > pivot]

    return quick_sort(less) + equal + quick_sort(more)
    

print(quick_sort(array_to_sort))