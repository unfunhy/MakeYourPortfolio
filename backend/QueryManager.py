def select_all_from_target_table(target, value, column=None):
    if column is None:
        data = target.query.all()
    else:
        data = target.query.filter(column == value).all()
        if len(data) == 1:
            data = data[0]

    return data